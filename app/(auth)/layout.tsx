"use client"
import type React from "react"
import { useRoleGuard } from "@/lib/hooks/useRoleGuard"

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  useRoleGuard()
  return (
    <div className="flex min-h-screen w-full">
      <main className="flex-1">{children}</main>
    </div>
  )
}
