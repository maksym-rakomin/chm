"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Send, Paperclip, MoreHorizontal, Menu, Plus, Star, Archive, Trash2 } from "lucide-react"
import { FloatingSidebarToggle } from "@/components/floating-sidebar-toggle"
import { useSidebarVisibility } from "@/components/sidebar-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState("1")
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const { isVisible, showSidebar } = useSidebarVisibility()

  const conversations = [
    {
      id: "1",
      name: "Dr. Sarah Smith",
      role: "Case Manager",
      lastMessage: "Patient Sarah Johnson's care plan has been updated. Please review the new medication schedule.",
      timestamp: "2 min ago",
      unread: true,
      avatar: "SS",
      priority: "high",
    },
    {
      id: "2",
      name: "Nurse Johnson",
      role: "Registered Nurse",
      lastMessage: "Morning rounds completed. All patients stable. Emma Davis requested to speak with family.",
      timestamp: "15 min ago",
      unread: true,
      avatar: "NJ",
      priority: "medium",
    },
    {
      id: "3",
      name: "PT Anderson",
      role: "Physical Therapist",
      lastMessage: "Robert Wilson showed great improvement in today's session. Recommending increased activity level.",
      timestamp: "1 hour ago",
      unread: false,
      avatar: "PA",
      priority: "low",
    },
    {
      id: "4",
      name: "Care Team",
      role: "Group Chat",
      lastMessage: "Weekly team meeting scheduled for Friday at 2 PM. Please confirm attendance.",
      timestamp: "2 hours ago",
      unread: false,
      avatar: "CT",
      priority: "medium",
    },
    {
      id: "5",
      name: "Dr. Wilson",
      role: "Medical Director",
      lastMessage: "New admission protocols have been updated. Training session next Monday.",
      timestamp: "1 day ago",
      unread: false,
      avatar: "DW",
      priority: "high",
    },
  ]

  const messages = [
    {
      id: "1",
      sender: "Dr. Sarah Smith",
      content: "Patient Sarah Johnson's care plan has been updated. Please review the new medication schedule.",
      timestamp: "2:30 PM",
      isOwn: false,
      attachments: ["care-plan-update.pdf"],
    },
    {
      id: "2",
      sender: "You",
      content: "Thanks for the update. I'll review it now and get back to you with any questions.",
      timestamp: "2:32 PM",
      isOwn: true,
      attachments: [],
    },
    {
      id: "3",
      sender: "Dr. Sarah Smith",
      content:
        "Perfect. Also, the family has requested a meeting to discuss the treatment plan. Can we schedule something for this week?",
      timestamp: "2:35 PM",
      isOwn: false,
      attachments: [],
    },
    {
      id: "4",
      sender: "You",
      content: "I can do Thursday afternoon or Friday morning. What works better for the family?",
      timestamp: "2:37 PM",
      isOwn: true,
      attachments: [],
    },
  ]

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive" className="text-xs">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="default" className="text-xs">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="secondary" className="text-xs">
            Low
          </Badge>
        )
      default:
        return null
    }
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const selectedConv = conversations.find((c) => c.id === selectedConversation)

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage("")
    }
  }

  return (
    <>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            {isVisible ? (
              <SidebarTrigger className="-ml-1" />
            ) : (
              <Button variant="ghost" size="icon" onClick={showSidebar} className="h-7 w-7" title="Show sidebar">
                <Menu className="h-4 w-4" />
              </Button>
            )}
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Messages</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
              <p className="text-muted-foreground">Communicate with your care team</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Message
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
            {/* Conversations List */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Conversations</CardTitle>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1 max-h-[500px] overflow-y-auto">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 cursor-pointer hover:bg-gray-50 border-l-4 ${
                        selectedConversation === conversation.id
                          ? "bg-blue-50 border-l-blue-500"
                          : conversation.unread
                            ? "border-l-orange-500"
                            : "border-l-transparent"
                      }`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder-user.jpg`} />
                          <AvatarFallback className="text-xs">{conversation.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium truncate ${conversation.unread ? "font-semibold" : ""}`}>
                              {conversation.name}
                            </p>
                            <div className="flex items-center space-x-1">
                              {getPriorityBadge(conversation.priority)}
                              {conversation.unread && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{conversation.role}</p>
                          <p
                            className={`text-sm text-muted-foreground truncate mt-1 ${conversation.unread ? "font-medium" : ""}`}
                          >
                            {conversation.lastMessage}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{conversation.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Message Thread */}
            <Card className="lg:col-span-2 flex flex-col">
              {selectedConv ? (
                <>
                  {/* Message Header */}
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`/placeholder-user.jpg`} />
                          <AvatarFallback>{selectedConv.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{selectedConv.name}</h3>
                          <p className="text-sm text-muted-foreground">{selectedConv.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getPriorityBadge(selectedConv.priority)}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Star className="mr-2 h-4 w-4" />
                              Star Conversation
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 overflow-y-auto space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] ${message.isOwn ? "order-2" : "order-1"}`}>
                          <div
                            className={`p-3 rounded-lg ${
                              message.isOwn ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            {message.attachments.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {message.attachments.map((attachment, index) => (
                                  <div key={index} className="flex items-center space-x-2 text-xs">
                                    <Paperclip className="h-3 w-3" />
                                    <span>{attachment}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <p
                            className={`text-xs text-muted-foreground mt-1 ${message.isOwn ? "text-right" : "text-left"}`}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                        {!message.isOwn && (
                          <Avatar className="h-6 w-6 order-1 mr-2">
                            <AvatarImage src={`/placeholder-user.jpg`} />
                            <AvatarFallback className="text-xs">{selectedConv.avatar}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                  </CardContent>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex items-end space-x-2">
                      <div className="flex-1">
                        <Textarea
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="min-h-[60px] resize-none"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              sendMessage()
                            }
                          }}
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button variant="outline" size="icon">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <p>Select a conversation to start messaging</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </SidebarInset>
      <FloatingSidebarToggle />
    </>
  )
}
