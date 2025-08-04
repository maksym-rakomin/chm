"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FilePenLineIcon as Signature, Trash2, Check, Type, PenTool } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ESignature() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [typedSignature, setTypedSignature] = useState("")
  const [signatureType, setSignatureType] = useState<"draw" | "type">("draw")

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.beginPath()
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
      }
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
        ctx.stroke()
      }
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
    setTypedSignature("")
  }

  const saveSignature = () => {
    // Implementation for saving signature
    console.log("Signature saved")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Signature className="mr-2 h-4 w-4" />
          Sign Document
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Electronic Signature</DialogTitle>
          <DialogDescription>Please provide your signature to complete the document</DialogDescription>
        </DialogHeader>

        <Tabs value={signatureType} onValueChange={(value) => setSignatureType(value as "draw" | "type")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="draw" className="flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              Draw
            </TabsTrigger>
            <TabsTrigger value="type" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Type
            </TabsTrigger>
          </TabsList>

          <TabsContent value="draw" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Draw Your Signature</CardTitle>
                <CardDescription>Use your mouse or touch to draw your signature</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={200}
                    className="w-full border rounded cursor-crosshair bg-white"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" onClick={clearSignature} className="flex-1 bg-transparent">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="type" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Type Your Signature</CardTitle>
                <CardDescription>Enter your full name as it appears on official documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="typed-signature">Full Name</Label>
                  <Input
                    id="typed-signature"
                    value={typedSignature}
                    onChange={(e) => setTypedSignature(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                {typedSignature && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                    <div className="text-2xl font-script italic text-center py-4 border-b-2 border-gray-400">
                      {typedSignature}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-2">By signing this document, I acknowledge that:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>I have read and understood the contents of this document</li>
                  <li>The information provided is accurate and complete</li>
                  <li>This electronic signature has the same legal effect as a handwritten signature</li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-muted-foreground">Signer</Label>
                  <p className="font-medium">John Doe</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Date</Label>
                  <p className="font-medium">{new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={saveSignature} className="flex-1">
                  <Check className="mr-2 h-4 w-4" />
                  Complete Signature
                </Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
