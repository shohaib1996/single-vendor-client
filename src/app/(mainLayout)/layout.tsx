import { Footer } from "@/components/Layout/Footer"
import { Navbar } from "@/components/Layout/Navbar"
import type React from "react"


export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}