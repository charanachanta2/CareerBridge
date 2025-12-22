import React from 'react'

export default function NeonButton({ children, variant = 'primary', className = '', onClick }){
  const glow = variant === 'primary' ? 'neon-btn glow' : 'neon-btn'
  return (
    <button onClick={onClick} className={`${glow} ${className}`}>
      {children}
    </button>
  )
}
