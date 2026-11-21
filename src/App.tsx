import { Suspense, lazy, useEffect } from 'react'
import { useStore } from '@/store'
import { useCursorTracker } from '@/hooks/useCursor'
import { useLenisSmoothScroll } from '@/hooks/useLenisSmoothScroll'
import CustomCursor from '@/components/ui/CustomCursor'
import Navbar from '@/components/ui/Navbar'
import ProgressRail from '@/components/ui/ProgressRail'
import TechBand from '@/components/ui/TechBand'
import LampPullCord from '@/components/ui/LampPullCord'
import Preloader from '@/components/sections/Preloader'

// Lazy-load sections for Phase 2 & Phase 3
const Hero = lazy(() => import('@/components/sections/Hero'))
const About = lazy(() => import('@/components/sections/About'))
const WhatIBuild = lazy(() => import('@/components/sections/WhatIBuild'))
const ProductionSystems = lazy(() => import('@/components/sections/ProductionSystems'))
const Contact = lazy(() => import('@/components/sections/Contact'))

export default function App() {
  const { theme, preloaderDone } = useStore()

  // Custom cursor tracking & Lenis smooth scroll
  useCursorTracker()
  useLenisSmoothScroll()

  // Sync theme with document element for CSS selectors
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    if (theme === 'light') {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    }
  }, [theme])

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        theme === 'light'
          ? 'light bg-[#F5F4F0] text-[#0F172A]'
          : 'dark bg-[#090A0E] text-[#F8FAFC]'
      } selection:bg-black/20 selection:text-black`}
    >
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Hanging Lamp Pull-Cord (Light/Dark Mode Interactive Thread) */}
      <LampPullCord />

      {/* Preloader */}
      {!preloaderDone && <Preloader />}

      {/* Main Experience once preloader finishes */}
      {preloaderDone && (
        <>
          <Navbar />
          <ProgressRail />
          <Suspense fallback={<div className="h-screen" />}>
            <main>
              {/* 01: Executive Hero */}
              <Hero />

              {/* 02: Intro / Engineering Dossier */}
              <About />

              {/* Infinite Tech Marquee Band */}
              <TechBand />

              {/* 03: What I Build / Capabilities (CAN DO) */}
              <WhatIBuild />

              {/* 04: Production Systems & Live Architecture Suite */}
              <ProductionSystems />

              {/* 05: Contact Dossier ("LET'S BUILD INTELLIGENT SYSTEMS.") */}
              <Contact />
            </main>
          </Suspense>
        </>
      )}
    </div>
  )
}
