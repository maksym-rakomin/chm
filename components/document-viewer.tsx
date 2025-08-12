"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  FileText,
  Download,
  Edit,
  Share,
  Clock,
  User,
  Calendar,
  CheckCircle,
  MessageSquare,
  Eye,
  FilePenLineIcon as Signature,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface DocumentViewerProps {
  document: {
    id: string
    name: string
    type: string
    status: string
    lastModified: string
    client: string
    modifiedBy: string
    size: string
    version: string
    category: string
  }
}

export function DocumentViewer({ document }: DocumentViewerProps) {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Dr. Smith",
      content: "Please review the medication dosages in section 3.",
      timestamp: "2024-12-01 10:30 AM",
      resolved: false,
    },
    {
      id: 2,
      author: "Nurse Johnson",
      content: "Updated vital signs recorded. All within normal ranges.",
      timestamp: "2024-12-01 2:15 PM",
      resolved: true,
    },
  ])

  const [newComment, setNewComment] = useState("")

  const addComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: "Current User",
        content: newComment,
        timestamp: new Date().toLocaleString(),
        resolved: false,
      }
      setComments([...comments, comment])
      setNewComment("")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      case "pending_signature":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending Signature
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            <Edit className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {document.name}
          </DialogTitle>
          <DialogDescription>
            Document ID: {document.id} • Client: {document.client}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Document Content Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Document Header */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">{document.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {document.type} • {document.category}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(document.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {document.lastModified}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {document.modifiedBy}
                    </span>
                    <span>{document.size}</span>
                    <Badge variant="outline">{document.version}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Document Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center min-h-[400px] flex items-center justify-center">
                  <div className="space-y-4">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Document Preview</h3>
                      <p className="text-gray-500">
                        {document.name} - {document.type}
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        This would show the actual document content, PDF viewer, or form fields
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        Full Screen
                      </Button>
                      {document.status === "pending_signature" && (
                        <Button>
                          <Signature className="mr-2 h-4 w-4" />
                          Sign Document
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Document Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Document Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Client</label>
                  <p className="text-sm">{document.client}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <p className="text-sm">{document.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <p className="text-sm">{document.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">{getStatusBadge(document.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Version</label>
                  <p className="text-sm">{document.version}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">File Size</label>
                  <p className="text-sm">{document.size}</p>
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Comments ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {comment.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{comment.author}</span>
                            {comment.resolved && <CheckCircle className="h-3 w-3 text-green-600" />}
                          </div>
                          <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                        </div>
                      </div>
                      <p className="text-sm pl-8">{comment.content}</p>
                      <Separator />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[60px]"
                  />
                  <Button size="sm" onClick={addComment} className="w-full">
                    Add Comment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
