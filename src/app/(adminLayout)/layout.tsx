"use client"

import { AppSidebar } from '@/components/AppSidebar/AppSidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { useAppSelector } from '@/redux/hooks/hooks'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

const AdminLayout = ({children}: {children: React.ReactNode}) => {
    const { user } = useAppSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    
      if (!user || user?.role !== "ADMIN") {
        toast.error("Access Denied: You must be an administrator to view this page.")
        router.push("/signin") // Redirect to the regular dashboard or sign-in
      }
    
  }, [user, router])

  if (!user || user.role !== "ADMIN") {
    // Optionally render a loading spinner or a simple message while checking auth
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading or redirecting...</p>
      </div>
    )
  }
  return (
<SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <main className="flex-1 p-1 lg:p-4 w-full min-w-0">{children}</main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}

export default AdminLayout
