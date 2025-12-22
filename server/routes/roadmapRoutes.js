const express = require('express');
const path = require('path');
const fs = require('fs');
let PDFDocument;
try {
  PDFDocument = require('pdfkit');
} catch (e) {
  // pdfkit may not be installed in developer environment; handle gracefully
  PDFDocument = null;
}
const Student = require('../models/Student');
const axios = require('axios');

const router = express.Router();

// Helper: load curated roadmaps JSON
const loadCurated = () => {
  try {
    const p = path.join(__dirname, '../../hybrid_roadmap/data/curated_roadmaps.json');
    const raw = fs.readFileSync(p, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Could not load curated_roadmaps.json', err.message);
    return {};
  }
};

// POST /api/roadmap/generate
// body: { studentId?: string, missingSkills?: [string] }
router.post('/generate', async (req, res) => {
  try {
    const { studentId, missingSkills } = req.body || {};
    let skills = Array.isArray(missingSkills) ? missingSkills : [];
    const useHybrid = req.body.useHybrid || process.env.HYBRID_ROADMAP_URL;

    if (studentId && (!skills || skills.length === 0)) {
      const student = await Student.findById(studentId).lean();
      if (!student) return res.status(404).json({ message: 'Student not found' });
      // If caller did not provide missingSkills, we cannot reliably compute them here.
      // Return empty timeline and let frontend provide missing skills from its matching logic.
      skills = [];
    }

    const curated = loadCurated();

    const timeline = [];
    let currentWeek = 1;

    if (!skills || skills.length === 0) {
      // If no missing skills provided, return an example personalized roadmap suggestions (top curated entries)
      Object.keys(curated).slice(0, 3).forEach((key) => {
        const item = curated[key];
        item.phases.forEach((phase) => {
          timeline.push({
            title: `${key} - ${phase.title}`,
            topics: phase.topics,
            duration_weeks: phase.duration_weeks || 1,
            resources: phase.resources || [],
            start_week: currentWeek
          });
          currentWeek += phase.duration_weeks || 1;
        });
      });
    } else if (useHybrid) {
      // Try to call the hybrid Python microservice for a personalized, detailed plan
      try {
        const hybridUrl = process.env.HYBRID_ROADMAP_URL || 'http://localhost:5002';
        const days = req.body.days || 28; // default to 4 weeks
        const user_profile = req.body.user_profile || {};
        const resp = await axios.post(`${hybridUrl}/generate-roadmap`, { missing_skills: skills, days, user_profile }, { timeout: 60000 });
        const d = resp.data || {};
        const plan = d.plan || d || {};
        const daily = plan.daily_plan || plan.dailyPlan || [];

        // Aggregate daily plan into weekly timeline (7-day weeks)
        const timelineAgg = [];
        for (let i = 0; i < daily.length; i += 7) {
          const weekSlice = daily.slice(i, i + 7);
          const weekNum = Math.floor(i / 7) + 1;
          const topicsSet = new Set();
          const tasks = [];
          const resources = [];
          weekSlice.forEach(day => {
            (day.focus || []).forEach(f => topicsSet.add(f));
            (day.tasks || []).forEach(t => tasks.push(t));
            (day.resources || []).forEach(r => {
              if (typeof r === 'string') resources.push(r);
              else if (r && r.url) resources.push(r.url);
              else if (r && r.title) resources.push(r.title);
            });
          });

          timelineAgg.push({
            title: `Week ${weekNum}: ${skills[0] || 'Focus'}`,
            topics: Array.from(topicsSet),
            duration_weeks: 1,
            resources: resources,
            start_week: weekNum,
            tasks: tasks
          });
        }

        const result = { generatedAt: new Date(), timeline: timelineAgg };
        return res.json(result);
      } catch (err) {
        console.warn('Hybrid roadmap service failed, falling back to curated', err.message || err);
        // fallthrough to curated fallback below
      }

    } else {
      
    }
    
    if (!skills || skills.length === 0) {
      // handled above
    } else {
      // Map each missing skill to curated roadmap when possible
      skills.forEach((skill) => {
        const lower = skill.toLowerCase();
        const matchKey = Object.keys(curated).find(k => k.toLowerCase().includes(lower) || lower.includes(k.toLowerCase()));
        if (matchKey) {
          curated[matchKey].phases.forEach((phase) => {
            timeline.push({
              title: `${matchKey} - ${phase.title}`,
              topics: phase.topics,
              duration_weeks: phase.duration_weeks || 1,
              resources: phase.resources || [],
              start_week: currentWeek
            });
            currentWeek += phase.duration_weeks || 1;
          });
        } else {
          // Fallback
          timeline.push({
            title: `${skill} - Foundations`,
            topics: ['Basics', 'Core Concepts', 'Small Project'],
            duration_weeks: 2,
            resources: [],
            start_week: currentWeek
          });
          currentWeek += 2;
          timeline.push({
            title: `${skill} - Intermediate`,
            topics: ['Applied Concepts', 'Project'],
            duration_weeks: 2,
            resources: [],
            start_week: currentWeek
          });
          currentWeek += 2;
        }
      });
    }

    const result = { generatedAt: new Date(), timeline };
    res.json(result);
  } catch (err) {
    console.error('Roadmap generate error', err);
    res.status(500).json({ message: 'Failed to generate roadmap' });
  }
});

// POST /api/roadmap/:studentId/pdf
// Body: { roadmap, title }
router.post('/:studentId/pdf', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { roadmap, title } = req.body || {};

    const student = await Student.findById(studentId).lean();
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (!PDFDocument) {
      return res.status(500).json({ message: 'PDF generation library not installed on server (pdfkit).' });
    }

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="roadmap-${studentId}.pdf"`);
    doc.pipe(res);

    doc.fontSize(20).text(title || `Personal Roadmap for ${student.name}`, { align: 'center' });
    doc.moveDown();

    if (!roadmap || !Array.isArray(roadmap.timeline)) {
      doc.fontSize(12).text('No roadmap content provided');
      doc.end();
      return;
    }

    roadmap.timeline.forEach((entry, idx) => {
      doc.fontSize(16).fillColor('#333').text(`${idx + 1}. ${entry.title}`);
      doc.fontSize(12).fillColor('#555').text(`Start week: ${entry.start_week} · Duration: ${entry.duration_weeks || 1} week(s)`);
      if (entry.topics && entry.topics.length) {
        doc.text('Topics: ' + entry.topics.join(', '));
      }
      if (entry.resources && entry.resources.length) {
        doc.moveDown(0.2);
        entry.resources.forEach((r) => doc.fontSize(10).fillColor('blue').text(r, { link: r }));
      }
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    console.error('PDF generate error', err);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
});

module.exports = router;
