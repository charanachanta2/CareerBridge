import React from 'react'
import '../styles/modern.css'
import FloatingBridge from '../components/FloatingBridge'
import NeonButton from '../components/NeonButton'
import DashboardPreview from '../components/DashboardPreview'

export default function LandingModern(){
  return (
    <div className="min-h-screen cb-hero text-white relative overflow-hidden">
      <div className="kinetic-light" />
      <header className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold">CareerBridge</div>
          <div className="tiny-muted">AI Roadmaps • Job Matching</div>
        </div>
        <div className="flex items-center gap-3">
          <NeonButton variant="ghost" className="bg-transparent border-0">Login</NeonButton>
          <NeonButton className="glow">Get Started</NeonButton>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <section>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">CareerBridge — Your Personalized Career Growth Companion</h1>
          <p className="tiny-muted mt-4 max-w-xl">Generate AI-driven study roadmaps, match to jobs, and track your career progress with cinematic UI and deep personalization.</p>

          <div className="mt-8 flex gap-4">
            <NeonButton className="glow">Get Started</NeonButton>
            <NeonButton variant="ghost" className="bg-transparent">Explore Features</NeonButton>
          </div>

          <div className="mt-12 flex gap-6">
            <div className="feature-icon glass">
              {/* AI Roadmaps icon */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M3 12h18" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div>
              <div className="text-white font-semibold">AI Roadmaps</div>
              <div className="tiny-muted">Personalized 15-day plans</div>
            </div>
          </div>
        </section>

        <section className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <FloatingBridge />
          </div>

          <div className="relative z-10 mt-10 lg:mt-0">
            <DashboardPreview />
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 tiny-muted text-center">© 2025 CareerBridge — Crafted with ❤️</footer>
    </div>
  )
}
