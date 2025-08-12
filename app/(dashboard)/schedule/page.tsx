"use client"
import { useRoleGuard } from "@/lib/hooks/useRoleGuard"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus, ChevronLeft, ChevronRight, Clock, User, MapPin } from "lucide-react"
import Header from "@/components/header";

export default function SchedulePage() {
  useRoleGuard()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState("week")

  const appointments = [
    {
      id: 1,
      title: "Initial Assessment - Sarah Johnson",
      client: "Sarah Johnson",
      staff: "Dr. Smith",
      time: "09:00 AM",
      duration: "60 min",
      type: "Assessment",
      location: "Room 101",
      status: "confirmed",
    },
    {
      id: 2,
      title: "Physical Therapy - Michael Brown",
      client: "Michael Brown",
      staff: "PT Anderson",
      time: "10:30 AM",
      duration: "45 min",
      type: "Therapy",
      location: "Therapy Room A",
      status: "confirmed",
    },
    {
      id: 3,
      title: "Care Plan Review - Emma Davis",
      client: "Emma Davis",
      staff: "Nurse Johnson",
      time: "02:00 PM",
      duration: "30 min",
      type: "Review",
      location: "Room 204",
      status: "pending",
    },
    {
      id: 4,
      title: "Medication Review - Robert Wilson",
      client: "Robert Wilson",
      staff: "Dr. Wilson",
      time: "03:30 PM",
      duration: "30 min",
      type: "Medical",
      location: "Medical Office",
      status: "confirmed",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="default">Confirmed</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      Assessment: "bg-blue-100 text-blue-800",
      Therapy: "bg-green-100 text-green-800",
      Review: "bg-purple-100 text-purple-800",
      Medical: "bg-red-100 text-red-800",
    }
    return <Badge className={colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"}>{type}</Badge>
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <SidebarInset>
      <Header pageTitle="Schedule" />

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
            <p className="text-muted-foreground">Manage appointments and staff schedules</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-lg font-semibold">{formatDate(currentDate)}</div>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Today
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Appointments and activities for {formatDate(currentDate)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-12 bg-blue-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{appointment.title}</h3>
                        {getStatusBadge(appointment.status)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {appointment.time} ({appointment.duration})
                        </div>
                        <div className="flex items-center">
                          <User className="mr-1 h-3 w-3" />
                          {appointment.staff}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          {appointment.location}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">{getTypeBadge(appointment.type)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Today's Appointments</span>
                  <Badge variant="outline">{appointments.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Confirmed</span>
                  <Badge variant="default">{appointments.filter((a) => a.status === "confirmed").length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending</span>
                  <Badge variant="secondary">{appointments.filter((a) => a.status === "pending").length}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Staff Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dr. Smith</span>
                  <Badge variant="default">Available</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Nurse Johnson</span>
                  <Badge variant="default">Available</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">PT Anderson</span>
                  <Badge variant="secondary">Busy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dr. Wilson</span>
                  <Badge variant="default">Available</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
