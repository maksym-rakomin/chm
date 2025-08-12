"use client"
import type React from "react"
import {SidebarProvider} from "@/components/ui/sidebar"
import {AppSidebar} from "@/components/app-sidebar"
import {SidebarVisibilityProvider} from "@/components/sidebar-context"
import { useRoleGuard } from "@/lib/hooks/useRoleGuard"

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  useRoleGuard()
  return (
    <SidebarVisibilityProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar/>
          <main className="flex-1">{children}</main>
        </div>
      </SidebarProvider>
    </SidebarVisibilityProvider>
  )
}
