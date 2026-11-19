import { Suspense, lazy, useEffect } from 'react'
import { useStore } from '@/store'
import { useKonamiCode, useTabVisibility } from '@/hooks/useEasterEggs'
import { useCursorTracker } from '@/hooks/useCursor'
import { useLenisSmoothScroll } from '@/hooks/useLenisSmoothScroll'
import CustomCursor from '@/components/ui/CustomCursor'
import Navbar from '@/components/ui/Navbar'
import ProgressRail from '@/components/ui/ProgressRail'
import ScrollCounter from '@/components/ui/ScrollCounter'
import Preloader from '@/components/sections/Preloader'
import BreakItGlitchZone from '@/components/ui/BreakItGlitchZone'

// Lazy-load heavy sections
const Hero = lazy(() => import('@/components/sections/Hero'))
const About = lazy(() => import('@/components/sections/About'))
const WhatIBuild = lazy(() => import('@/components/sections/WhatIBuild'))
const Work = lazy(() => import('@/components/sections/Work'))
const Skills = lazy(() => import('@/components/sections/Skills'))
const Journey = lazy(() => import('@/components/sections/Journey'))
const Certifications = lazy(() => import('@/components/sections/Certifications'))
const Contact = lazy(() => import('@/components/sections/Contact'))

export default function App() {
  const { preloaderDone, theme, bujjiMode } = useStore()

  useKonamiCode()
  useTabVisibility()
  useCursorTracker()
  useLenisSmoothScroll()

  useEffect(() => {
    if (bujjiMode) {
      document.body.classList.add('bujji-mode')
    } else {
      document.body.classList.remove('bujji-mode')
    }
  }, [bujjiMode])

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div className={`min-h-screen bg-bg text-warm-white ${bujjiMode ? 'bujji-mode' : ''}`}>
      <CustomCursor />
      {!preloaderDone && <Preloader />}
      {preloaderDone && (
        <>
          <Navbar />
          <ProgressRail />
          <ScrollCounter />
          <Suspense fallback={<div className="h-screen bg-bg" />}>
            <main>
              <Hero />
              <About />
              <WhatIBuild />
              <Work />
              <Skills />
              <Journey />
              <Certifications />
              <BreakItGlitchZone />
              <Contact />
            </main>
          </Suspense>
        </>
      )}
    </div>
  )
}
