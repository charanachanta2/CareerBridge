import { useEffect, useState } from 'react'
import API from '../../api/axios'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { motion } from 'framer-motion'
import RoadmapViewer from '../../components/RoadmapViewer'
import { DownloadCloud } from 'lucide-react'

export default function Roadmaps() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [missingSkills, setMissingSkills] = useState([])
  const [roadmap, setRoadmap] = useState(null)
  const [viewerOpen, setViewerOpen] = useState(false)

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    setLoading(true)
    try {
      const res = await API.get('/student/jobs')
      setJobs(res.data)
      aggregateMissing(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const aggregateMissing = (jobs) => {
    const counts = {}
    jobs.forEach(j => {
      const miss = j.studentMatch?.missing_skills || []
      miss.forEach(s => { counts[s] = (counts[s] || 0) + 1 })
    })
    // take top N missing skills
    const sorted = Object.keys(counts).sort((a,b)=>counts[b]-counts[a])
    setMissingSkills(sorted.slice(0, 12))
  }

  const generateRoadmap = async () => {
    try {
      // include user profile for personalization
      const profile = await API.get('/student/profile')
      const user_profile = { name: profile.data.name, level: profile.data.level || 'beginner', learning_style: 'balanced', daily_hours: 2 }
      const res = await API.post('/roadmap/generate', { missingSkills, useHybrid: true, use_gemini: true, days: 28, user_profile })
      setRoadmap(res.data)
      setViewerOpen(true)
    } catch (err) {
      console.error('Generate roadmap error', err)
      alert('Failed to generate roadmap')
    }
  }

  const generateForSkill = async (skill) => {
    try {
      const profile = await API.get('/student/profile')
      const user_profile = { name: profile.data.name, level: profile.data.level || 'beginner', learning_style: 'project-based', daily_hours: 2 }
      const res = await API.post('/roadmap/generate', { missingSkills: [skill], useHybrid: true, use_gemini: true, days: 28, user_profile })
      setRoadmap(res.data)
      setViewerOpen(true)
    } catch (err) {
      console.error('Generate roadmap error', err)
      alert('Failed to generate roadmap for ' + skill)
    }
  }

  const exportPdf = async () => {
    try {
      const profile = await API.get('/student/profile')
      const studentId = profile.data._id
      const res = await API.post(`/roadmap/${studentId}/pdf`, { roadmap, title: `Roadmap - ${profile.data.name}` }, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `roadmap-${studentId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.parentElement.removeChild(link)
    } catch (err) {
      console.error('Export PDF error', err)
      alert('Failed to export PDF. Ensure server has pdfkit installed.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Your Roadmaps</h1>
              <p className="text-gray-600">Auto-generated learning paths based on your missing skills</p>
            </div>
            <div className="flex gap-3">
              <button onClick={generateRoadmap} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg">Generate Roadmap</button>
              <button onClick={exportPdf} disabled={!roadmap} className="px-4 py-2 bg-white border rounded-lg flex items-center gap-2">
                <DownloadCloud size={16} /> Export PDF
              </button>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="font-semibold mb-3">Top Missing Skills</h2>
            {loading ? (
              <p>Loading...</p>
            ) : missingSkills.length === 0 ? (
              <p className="text-gray-500">No missing skills detected. Visit Jobs to see matches.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {missingSkills.map((s, idx) => (
                  <motion.div key={s} whileHover={{ scale: 1.03 }} className="bg-white p-3 rounded-lg shadow">
                    <p className="text-sm font-semibold">{s}</p>
                    <p className="text-xs text-gray-500">Missing in multiple jobs</p>
                    <div className="mt-3 flex gap-2">
                      <button onClick={()=>generateForSkill(s)} className="px-3 py-1 text-xs bg-indigo-600 text-white rounded">Generate Roadmap</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="font-semibold mb-3">Suggested Roadmap</h2>
            {roadmap ? (
              <div className="space-y-3">
                {roadmap.timeline.map((entry, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold">{entry.title}</h3>
                        <p className="text-sm text-gray-500">Week {entry.start_week} · {entry.duration_weeks} week(s)</p>
                      </div>
                      <div className="text-sm text-gray-600">{entry.topics?.length || 0} topics</div>
                    </div>
                    <div className="mt-3 text-sm text-gray-700">
                      <strong>Topics:</strong> {entry.topics?.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Generate a roadmap to preview suggested phases and tasks.</p>
            )}
          </section>
        </main>
      </div>

      <RoadmapViewer open={viewerOpen} roadmap={roadmap} onClose={() => setViewerOpen(false)} />
    </div>
  )
}
