import React from 'react'

export default function FloatingBridge({ className = '' }){
  return (
    <div className={`bridge-3d ${className} relative`} aria-hidden>
      {/* stylized 3D bridge using SVG layers and gradients */}
      <svg viewBox="0 0 800 480" className="w-full h-full rotate-slow">
        <defs>
          <linearGradient id="gBridge" x1="0" x2="1">
            <stop offset="0%" stopColor="#7C3AEF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <g transform="translate(0,40)">
          <path d="M20,300 C200,120 400,120 780,300 L780,360 C400,180 200,180 20,360 Z" fill="url(#gBridge)" opacity="0.18" />
        </g>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-56 h-32 glass rounded-3xl floating-card float-slow flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-2xl font-semibold">CareerBridge</div>
            <div className="tiny-muted mt-1">Bridge to your next role</div>
          </div>
        </div>
      </div>
    </div>
  )
}
