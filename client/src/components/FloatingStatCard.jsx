import React from 'react'

export default function FloatingStatCard({ title, value, trend }){
  return (
    <div className="glass p-4 rounded-2xl floating-card w-56">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm tiny-muted">{title}</div>
          <div className="text-2xl font-semibold text-white">{value}</div>
        </div>
        <div className={`stat-dot ${trend === 'up' ? 'bg-teal-400' : 'bg-pink-400'}`} />
      </div>
      <div className="tiny-muted mt-2">{trend === 'up' ? 'Improving' : 'Needs attention'}</div>
    </div>
  )
}
