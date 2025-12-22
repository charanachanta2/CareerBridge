import { motion } from 'framer-motion'

const RoadmapViewer = ({ open, roadmap, onClose }) => {
  if (!open || !roadmap) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 p-6 overflow-auto" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e)=>e.stopPropagation()} className="max-w-4xl mx-auto bg-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Detailed Roadmap</h2>
          <button onClick={onClose} className="text-gray-600">Close</button>
        </div>

        <div className="relative">
          {/* Vertical timeline */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
          <div className="space-y-8 pl-12">
            {roadmap.timeline.map((entry, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-2 top-1 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-sm" />
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{entry.title}</h3>
                      <p className="text-sm text-gray-500">Week {entry.start_week} · {entry.duration_weeks} week(s)</p>
                    </div>
                    <div className="text-sm text-gray-600">{entry.topics?.length || 0} topics</div>
                  </div>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="font-semibold">Followups / Tasks</p>
                      <ul className="list-disc ml-5 text-sm">
                        {entry.topics?.map((t, i) => (
                          <li key={i} className="py-0.5">{t}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold">Resources</p>
                      {entry.resources && entry.resources.length > 0 ? (
                        <ul className="list-disc ml-5 text-sm">
                          {entry.resources.map((r, i) => (
                            <li key={i}><a className="text-blue-600 hover:underline" href={r} target="_blank" rel="noreferrer">{r}</a></li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No external resources provided</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default RoadmapViewer
