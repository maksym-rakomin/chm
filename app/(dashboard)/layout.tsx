"use client"
import type React from "react"
import {SidebarProvider} from "@/components/ui/sidebar"
import {AppSidebar} from "@/components/app-sidebar"
import {SidebarVisibilityProvider} from "@/components/sidebar-context"
import {useRoleGuard} from "@/lib/hooks/useRoleGuard"
import QueryProvider from "@/lib/providers/QueryProvider";

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  useRoleGuard()
  return (
    <QueryProvider>
      <SidebarVisibilityProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar side="left"/>
            <div className="flex-1">{children}</div>
          </div>
        </SidebarProvider>
      </SidebarVisibilityProvider>
    </QueryProvider>
  )
}
