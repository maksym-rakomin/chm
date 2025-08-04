"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useSidebarVisibility } from "./sidebar-context"
import { cn } from "@/lib/utils"

export function FloatingSidebarToggle() {
  const { isVisible, showSidebar } = useSidebarVisibility()

  if (isVisible) {
    return null
  }

  return (
    <Button
      onClick={showSidebar}
      size="icon"
      className={cn(
        "fixed bottom-6 left-6 z-50 h-12 w-12 rounded-full shadow-lg",
        "bg-primary hover:bg-primary/90 text-primary-foreground",
        "transition-all duration-200 hover:scale-110",
      )}
      title="Show sidebar"
    >
      <Menu className="h-5 w-5" />
    </Button>
  )
}
