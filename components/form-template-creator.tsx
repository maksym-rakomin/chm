"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Plus,} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import dynamic from "next/dynamic";

const CustomFormBuilder = dynamic(
  () => import('@/app/(dashboard)/settings/_components/form-builder'),
  {ssr: false}
);

interface FormTemplateCreatorProps {
  open?: boolean | undefined
  onOpenChange?: (open: boolean) => void | undefined
}

export function FormTemplateCreator({open, onOpenChange}: FormTemplateCreatorProps) {
  const [internalOpen, setInternalOpen] = useState(false)

  const isControlled = open !== undefined
  const dialogOpen = isControlled ? (open as boolean) : internalOpen
  const handleOpenChange = (value: boolean) => {
    onOpenChange?.(value)
    if (!isControlled) setInternalOpen(value)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {(open === undefined && onOpenChange === undefined) ?? <DialogTrigger asChild>
          <Button onClick={() => handleOpenChange(true)}>
              <Plus className="mr-2 h-4 w-4"/>
              Create Template
          </Button>
      </DialogTrigger>}

      <DialogContent className="w-full h-full max-w-full p-0 border-none sm:rounded-none gap-2 flex flex-col items-start">
        <DialogHeader className="p-4">
          <DialogTitle>Create Document Template</DialogTitle>
          <DialogDescription>Build a custom template for documents and forms</DialogDescription>
        </DialogHeader>

        <CustomFormBuilder setVisibleDialog={handleOpenChange}/>
      </DialogContent>
    </Dialog>
  )
}
