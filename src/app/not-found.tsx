"use client"

import Link from 'next/link'
import { easeInOut, easeOut, motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import Image from 'next/image'

export default function NotFound() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: easeOut
      }
    }
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: easeInOut
      }
    }
  }

  const glitchVariants = {
    animate: {
      x: [-2, 2, -2, 2, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 3,
        ease: easeInOut
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        className="text-center z-10 max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated GIF/Image */}
        <motion.div
          className="mb-8"
          variants={floatingVariants}
          animate="animate"
        >
          <Image
            src="https://yoast.com/app/uploads/2015/08/404_error_checking_FI.png"
            alt="404 Error Illustration"
            className="mx-auto rounded-lg shadow-2xl"
            width={300}
            height={200}
          />
        </motion.div>

        {/* Glitch effect on 404 */}
        <motion.div
          variants={glitchVariants}
          animate="animate"
          className="mb-6"
        >
          <motion.h1
            className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-4"
            variants={itemVariants}
          >
            404
          </motion.h1>
        </motion.div>

        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white mb-4"
          variants={itemVariants}
        >
          Oops! Page Not Found
        </motion.h2>

        <motion.p
          className="text-lg text-gray-300 mb-8 leading-relaxed"
          variants={itemVariants}
        >
          Looks like you&apos;ve ventured into the digital void. The page you&apos;re looking for has drifted away into cyberspace.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          variants={itemVariants}
        >
          <Link href="/">
            <motion.button
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-lg overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <span className="relative flex items-center gap-2">
                <Home className="w-5 h-5" />
                Return Home
              </span>
            </motion.button>
          </Link>

          <motion.button
            className="group px-8 py-4 border-2 border-purple-400 text-purple-400 font-semibold rounded-full hover:bg-purple-400 hover:text-white transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </span>
          </motion.button>
        </motion.div>

        {/* Animated decorative elements */}
        <motion.div
          className="mt-12 flex justify-center space-x-4"
          variants={itemVariants}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-purple-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Corner decorations */}
      <motion.div
        className="absolute top-10 left-10 w-20 h-20 border-2 border-purple-400 rounded-full opacity-30"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-16 h-16 border-2 border-pink-400 rounded-full opacity-30"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}
