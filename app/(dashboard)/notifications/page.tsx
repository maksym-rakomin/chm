"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Search,
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Calendar,
  Menu,
  Settings,
  BookMarkedIcon as MarkAsUnread,
  Trash2,
  Filter,
} from "lucide-react"
import { FloatingSidebarToggle } from "@/components/floating-sidebar-toggle"
import { useSidebarVisibility } from "@/components/sidebar-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header";

export default function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const { isVisible, showSidebar } = useSidebarVisibility()

  const notifications = [
    {
      id: "1",
      type: "urgent",
      title: "Patient Emergency Alert",
      message: "Sarah Johnson (Room 204) requires immediate medical attention. Vital signs abnormal.",
      timestamp: "2 minutes ago",
      read: false,
      source: "Medical Alert System",
      priority: "high",
      actionRequired: true,
    },
    {
      id: "2",
      type: "reminder",
      title: "Medication Due",
      message: "Michael Brown's evening medication is due in 15 minutes.",
      timestamp: "13 minutes ago",
      read: false,
      source: "Medication Management",
      priority: "medium",
      actionRequired: true,
    },
    {
      id: "3",
      type: "info",
      title: "Staff Meeting Reminder",
      message: "Weekly care team meeting starts in 1 hour in Conference Room A.",
      timestamp: "45 minutes ago",
      read: true,
      source: "Calendar",
      priority: "low",
      actionRequired: false,
    },
    {
      id: "4",
      type: "system",
      title: "Document Signature Required",
      message: "Emma Davis's care plan update requires your signature for approval.",
      timestamp: "1 hour ago",
      read: false,
      source: "Document Management",
      priority: "medium",
      actionRequired: true,
    },
    {
      id: "5",
      type: "reminder",
      title: "Assessment Overdue",
      message: "Quarterly assessment for Robert Wilson is 2 days overdue.",
      timestamp: "2 hours ago",
      read: true,
      source: "Assessment Tracker",
      priority: "high",
      actionRequired: true,
    },
    {
      id: "6",
      type: "info",
      title: "New Staff Onboarded",
      message: "Lisa Chen has completed onboarding and is now active in the system.",
      timestamp: "1 day ago",
      read: true,
      source: "HR System",
      priority: "low",
      actionRequired: false,
    },
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "reminder":
        return <Bell className="h-5 w-5 text-orange-600" />
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />
      case "system":
        return <Settings className="h-5 w-5 text-purple-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge variant="default">Medium</Badge>
      case "low":
        return <Badge variant="secondary">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>
      case "reminder":
        return (
          <Badge variant="default" className="bg-orange-100 text-orange-800">
            Reminder
          </Badge>
        )
      case "info":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Info
          </Badge>
        )
      case "system":
        return (
          <Badge variant="default" className="bg-purple-100 text-purple-800">
            System
          </Badge>
        )
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || notification.type === filterType
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "unread" && !notification.read) ||
      (filterStatus === "read" && notification.read)
    return matchesSearch && matchesType && matchesStatus
  })

  const notificationStats = {
    total: notifications.length,
    unread: notifications.filter((n) => !n.read).length,
    urgent: notifications.filter((n) => n.type === "urgent").length,
    actionRequired: notifications.filter((n) => n.actionRequired && !n.read).length,
  }

  const markAsRead = (id: string) => {
    // Implementation for marking notification as read
    console.log("Mark as read:", id)
  }

  const markAllAsRead = () => {
    // Implementation for marking all notifications as read
    console.log("Mark all as read")
  }

  return (
    <>
      <SidebarInset>
        <Header pageTitle="Notifications" />

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
              <p className="text-muted-foreground">Stay updated with important alerts and reminders</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={markAllAsRead}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark All Read
              </Button>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notificationStats.total}</div>
                <p className="text-xs text-muted-foreground">All notifications</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unread</CardTitle>
                <MarkAsUnread className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notificationStats.unread}</div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Urgent</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notificationStats.urgent}</div>
                <p className="text-xs text-muted-foreground">High priority alerts</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Action Required</CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notificationStats.actionRequired}</div>
                <p className="text-xs text-muted-foreground">Need your response</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="notifications" className="w-full">
            <TabsList>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="settings">Notification Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Notifications</CardTitle>
                  <CardDescription>Manage your alerts and system notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search notifications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="unread">Unread</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border rounded-lg transition-colors ${
                          !notification.read ? "bg-blue-50 border-blue-200" : "bg-white"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className={`font-medium ${!notification.read ? "font-semibold" : ""}`}>
                                {notification.title}
                              </h3>
                              <div className="flex items-center space-x-2">
                                {getTypeBadge(notification.type)}
                                {getPriorityBadge(notification.priority)}
                                {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <span>{notification.timestamp}</span>
                                <span>From: {notification.source}</span>
                                {notification.actionRequired && (
                                  <Badge variant="outline" className="text-xs">
                                    Action Required
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                {!notification.read && (
                                  <Button size="sm" variant="outline" onClick={() => markAsRead(notification.id)}>
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                    Mark Read
                                  </Button>
                                )}
                                {notification.actionRequired && <Button size="sm">Take Action</Button>}
                                <Button size="sm" variant="ghost">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Configure how and when you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Email Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="urgent-email">Urgent Alerts</Label>
                          <p className="text-sm text-muted-foreground">Immediate email for critical patient alerts</p>
                        </div>
                        <Switch id="urgent-email" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="reminder-email">Medication Reminders</Label>
                          <p className="text-sm text-muted-foreground">Email reminders for medication schedules</p>
                        </div>
                        <Switch id="reminder-email" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="meeting-email">Meeting Notifications</Label>
                          <p className="text-sm text-muted-foreground">Email notifications for scheduled meetings</p>
                        </div>
                        <Switch id="meeting-email" />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Push Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="urgent-push">Emergency Alerts</Label>
                          <p className="text-sm text-muted-foreground">Instant push notifications for emergencies</p>
                        </div>
                        <Switch id="urgent-push" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="task-push">Task Reminders</Label>
                          <p className="text-sm text-muted-foreground">Push notifications for assigned tasks</p>
                        </div>
                        <Switch id="task-push" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="system-push">System Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Notifications about system maintenance and updates
                          </p>
                        </div>
                        <Switch id="system-push" />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Quiet Hours</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="quiet-hours">Enable Quiet Hours</Label>
                          <p className="text-sm text-muted-foreground">
                            Reduce non-urgent notifications during specified hours
                          </p>
                        </div>
                        <Switch id="quiet-hours" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="quiet-start">Start Time</Label>
                          <Input id="quiet-start" type="time" defaultValue="22:00" />
                        </div>
                        <div>
                          <Label htmlFor="quiet-end">End Time</Label>
                          <Input id="quiet-end" type="time" defaultValue="07:00" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
      <FloatingSidebarToggle />
    </>
  )
}
