"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronUp } from "lucide-react"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility)
    return () => {
      window.removeEventListener("scroll", toggleVisibility)
    }
  }, [])

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Button
            onClick={scrollToTop}
            size="icon"
            className="w-12 h-12 rounded-full bg-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
          >
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-primary rounded-full blur-xl group-hover:bg-emerald-400/30 transition-all duration-300" />

            {/* Animated background circle */}
            <motion.div
              className="absolute inset-0 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            {/* Icon with animation */}
            <motion.div
              animate={{
                y: [0, -2, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="relative z-10"
            >
              <ChevronUp className="h-6 w-6 group-hover:scale-110 transition-transform duration-300 "  />
            </motion.div>

            {/* Ripple effect on hover */}
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.4 }}
            />
          </Button>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap font-mono">
              Back to top
            </div>
            <div className="w-2 h-2 bg-foreground transform rotate-45 mx-auto -mt-1"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}