"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [sectionsCount, setSectionsCount] = useState(0)

  useEffect(() => {
    if (typeof window === "undefined") return

    const container = containerRef.current
    if (!container) return

    const sections = Array.from(container.querySelectorAll("section[id]")) as HTMLElement[]
    if (sections.length === 0) return

    setSectionsCount(sections.length)

    // Smooth scroll function
    const smoothScrollTo = (targetPosition: number, callback?: () => void) => {
      const startPosition = window.scrollY
      const distance = targetPosition - startPosition
      const duration = 1000
      let startTime: number | null = null

      const animateScroll = (currentTime: number) => {
        if (startTime === null) startTime = currentTime
        const timeElapsed = currentTime - startTime
        const progress = Math.min(timeElapsed / duration, 1)
        
        // Easing function (easeInOutCubic)
        const ease = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2

        window.scrollTo(0, startPosition + distance * ease)

        if (progress < 1) {
          requestAnimationFrame(animateScroll)
        } else if (callback) {
          callback()
        }
      }

      requestAnimationFrame(animateScroll)
    }

    // Find current section index
    const getCurrentSectionIndex = (): number => {
      const viewportCenter = window.innerHeight / 2
      for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].getBoundingClientRect()
        if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
          return i
        }
      }
      // Fallback: find closest section
      let closestIndex = 0
      let closestDistance = Infinity
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect()
        const distance = Math.abs(rect.top - viewportCenter)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })
      return closestIndex
    }

    let isScrolling = false
    let scrollTimeout: ReturnType<typeof setTimeout>

    // Wheel scroll handler - only trigger on significant scroll
    const handleWheel = (e: WheelEvent) => {
      // Allow normal scroll for small movements or if already scrolling
      if (isScrolling || Math.abs(e.deltaY) < 30) {
        return
      }

      const currentIndex = getCurrentSectionIndex()
      let targetIndex = currentIndex

      // Only snap if scrolling significantly
      if (e.deltaY > 50 && currentIndex < sections.length - 1) {
        targetIndex = currentIndex + 1
      } else if (e.deltaY < -50 && currentIndex > 0) {
        targetIndex = currentIndex - 1
      } else {
        return
      }

      isScrolling = true
      e.preventDefault()
      e.stopPropagation()

      const targetSection = sections[targetIndex]
      const targetPosition = Math.max(0, targetSection.getBoundingClientRect().top + window.scrollY - 50)

      smoothScrollTo(targetPosition, () => {
        isScrolling = false
        setCurrentSection(targetIndex)
      })

      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        isScrolling = false
      }, 1200)
    }

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling || (e.key !== "ArrowDown" && e.key !== "ArrowUp")) return

      const currentIndex = getCurrentSectionIndex()
      let targetIndex = currentIndex

      if (e.key === "ArrowDown" && currentIndex < sections.length - 1) {
        targetIndex = currentIndex + 1
      } else if (e.key === "ArrowUp" && currentIndex > 0) {
        targetIndex = currentIndex - 1
      } else {
        return
      }

      e.preventDefault()
      isScrolling = true

      const targetSection = sections[targetIndex]
      const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY

      smoothScrollTo(targetPosition, () => {
        isScrolling = false
        setCurrentSection(targetIndex)
      })
    }

    // ScrollTrigger for animations
    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => setCurrentSection(index),
        onEnterBack: () => setCurrentSection(index),
      })

      // Subtle fade-in animation
      gsap.fromTo(
        section,
        {
          opacity: 0.7,
        },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
        }
      )
    })

    // Scroll progress indicator
    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const progress = self.progress
        document.documentElement.style.setProperty("--scroll-progress", `${progress}`)
      },
    })

    // Add event listeners with debounce
    let wheelTimeout: ReturnType<typeof setTimeout>
    const debouncedWheel = (e: WheelEvent) => {
      clearTimeout(wheelTimeout)
      wheelTimeout = setTimeout(() => handleWheel(e), 100)
    }

    window.addEventListener("wheel", debouncedWheel, { passive: false })
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("wheel", debouncedWheel)
      window.removeEventListener("keydown", handleKeyDown)
      clearTimeout(scrollTimeout)
      clearTimeout(wheelTimeout)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <>
      {/* Scroll Progress Indicator */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 origin-left z-50 pointer-events-none" 
        style={{ transform: `scaleX(var(--scroll-progress, 0))` }} 
      />
      
      {/* Section Indicator */}
      {sectionsCount > 0 && (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3">
          {Array.from({ length: sectionsCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const container = containerRef.current
                if (!container) return
                
                const sections = Array.from(container.querySelectorAll("section[id]")) as HTMLElement[]
                if (sections[i]) {
                  const targetPosition = sections[i].getBoundingClientRect().top + window.scrollY
                  const startPosition = window.scrollY
                  const distance = targetPosition - startPosition
                  const duration = 1000
                  let startTime: number | null = null

                  const animateScroll = (currentTime: number) => {
                    if (startTime === null) startTime = currentTime
                    const timeElapsed = currentTime - startTime
                    const progress = Math.min(timeElapsed / duration, 1)
                    
                    const ease = progress < 0.5
                      ? 4 * progress * progress * progress
                      : 1 - Math.pow(-2 * progress + 2, 3) / 2

                    window.scrollTo(0, startPosition + distance * ease)

                    if (progress < 1) {
                      requestAnimationFrame(animateScroll)
                    } else {
                      setCurrentSection(i)
                    }
                  }

                  requestAnimationFrame(animateScroll)
                }
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSection === i
                  ? "bg-blue-600 scale-150"
                  : "bg-slate-400 dark:bg-slate-600 hover:bg-slate-600 dark:hover:bg-slate-400"
              }`}
              aria-label={`Go to section ${i + 1}`}
            />
          ))}
        </div>
      )}

      <div ref={containerRef} className="smooth-scroll-container">
        {children}
      </div>
    </>
  )
}
