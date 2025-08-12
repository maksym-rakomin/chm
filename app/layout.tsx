import type React from "react"
import type {Metadata} from "next"
import {Inter} from "next/font/google"
import {Toaster} from "@/components/ui/sonner"
import "./globals.css"
import { ClientBootstrap } from "@/components/client-bootstrap"

const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
  title: "Care Homes Management System",
  description: "Comprehensive platform for medical and social service organizations",
  generator: 'v0.dev'
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    <body className={inter.className + "flex min-h-screen w-full"}>

    <main className="flex-1">{children}</main>

    <Toaster richColors closeButton position="top-center" theme="light" />

    <ClientBootstrap />
    </body>
    </html>
  )
}
