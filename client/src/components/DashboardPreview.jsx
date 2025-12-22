import React from 'react'
import FloatingStatCard from './FloatingStatCard'

export default function DashboardPreview(){
  return (
    <div className="glass p-6 rounded-3xl floating-card">
      <div className="flex items-start gap-6 md:gap-10 lg:gap-16">
        <div className="flex-1">
          <div className="flex gap-4 mb-4">
            <FloatingStatCard title="Skill Match" value="82%" trend="up" />
            <FloatingStatCard title="Applications" value="24" trend="up" />
            <FloatingStatCard title="Placements" value="6" trend="up" />
          </div>

          <div className="glass p-4 rounded-2xl mt-4">
            <div className="flex items-center justify-between">
              <div className="text-sm tiny-muted">Weekly Progress</div>
              <div className="text-sm tiny-muted">56%</div>
            </div>
            <div className="w-full bg-white/6 rounded-full h-3 mt-3 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-blue-400 h-3 rounded-full" style={{width:'56%'}}></div>
            </div>
          </div>
        </div>

        <div className="w-80">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center text-white">KR</div>
            <div>
              <div className="text-white font-semibold">Kratika Agrawal</div>
              <div className="tiny-muted">Product Designer • IIIT</div>
            </div>
          </div>

          <div className="mt-5 glass p-3 rounded-2xl">
            <div className="tiny-muted">Roadmap</div>
            <div className="text-white font-medium mt-2">Frontend Mastery • 15 days</div>
            <div className="w-full bg-white/6 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-400 to-indigo-500 h-2 rounded-full" style={{width:'40%'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
