"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface SidebarVisibilityContextType {
  isVisible: boolean
  toggleVisibility: () => void
  showSidebar: () => void
  hideSidebar: () => void
}

const SidebarVisibilityContext = createContext<SidebarVisibilityContextType | undefined>(undefined)

export function useSidebarVisibility() {
  const context = useContext(SidebarVisibilityContext)
  if (context === undefined) {
    throw new Error("useSidebarVisibility must be used within a SidebarVisibilityProvider")
  }
  return context
}

export function SidebarVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(true)

  // Load saved preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-visibility")
    if (saved !== null) {
      setIsVisible(JSON.parse(saved))
    }
  }, [])

  // Save preference to localStorage
  useEffect(() => {
    localStorage.setItem("sidebar-visibility", JSON.stringify(isVisible))
  }, [isVisible])

  const toggleVisibility = () => setIsVisible(!isVisible)
  const showSidebar = () => setIsVisible(true)
  const hideSidebar = () => setIsVisible(false)

  return (
    <SidebarVisibilityContext.Provider
      value={{
        isVisible,
        toggleVisibility,
        showSidebar,
        hideSidebar,
      }}
    >
      {children}
    </SidebarVisibilityContext.Provider>
  )
}
