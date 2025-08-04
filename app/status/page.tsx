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
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  ArrowRight,
  Menu,
  User,
  Calendar,
  FileText,
} from "lucide-react"
import { FloatingSidebarToggle } from "@/components/floating-sidebar-toggle"
import { useSidebarVisibility } from "@/components/sidebar-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function StatusTrackerPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { isVisible, showSidebar } = useSidebarVisibility()

  const patientWorkflows = [
    {
      id: "P001",
      name: "Sarah Johnson",
      currentStage: "Care Plan Review",
      progress: 75,
      status: "in_progress",
      daysInStage: 3,
      nextAction: "Medical Assessment",
      assignedTo: "Dr. Smith",
      priority: "high",
      stages: [
        { name: "Initial Review", status: "completed", date: "2024-11-15" },
        { name: "Documentation", status: "completed", date: "2024-11-18" },
        { name: "Medical Assessment", status: "completed", date: "2024-11-22" },
        { name: "Care Plan Review", status: "in_progress", date: "2024-11-25" },
        { name: "Final Approval", status: "pending", date: null },
        { name: "Onboarding", status: "pending", date: null },
      ],
    },
    {
      id: "P002",
      name: "Michael Brown",
      currentStage: "Initial Review",
      progress: 20,
      status: "under_review",
      daysInStage: 1,
      nextAction: "Complete intake forms",
      assignedTo: "Nurse Johnson",
      priority: "medium",
      stages: [
        { name: "Initial Review", status: "in_progress", date: "2024-12-01" },
        { name: "Documentation", status: "pending", date: null },
        { name: "Medical Assessment", status: "pending", date: null },
        { name: "Care Plan Review", status: "pending", date: null },
        { name: "Final Approval", status: "pending", date: null },
        { name: "Onboarding", status: "pending", date: null },
      ],
    },
    {
      id: "P003",
      name: "Emma Davis",
      currentStage: "Onboarding",
      progress: 100,
      status: "completed",
      daysInStage: 0,
      nextAction: "None - Completed",
      assignedTo: "Dr. Wilson",
      priority: "low",
      stages: [
        { name: "Initial Review", status: "completed", date: "2024-10-15" },
        { name: "Documentation", status: "completed", date: "2024-10-18" },
        { name: "Medical Assessment", status: "completed", date: "2024-10-22" },
        { name: "Care Plan Review", status: "completed", date: "2024-10-25" },
        { name: "Final Approval", status: "completed", date: "2024-10-28" },
        { name: "Onboarding", status: "completed", date: "2024-11-01" },
      ],
    },
    {
      id: "P004",
      name: "Robert Wilson",
      currentStage: "Medical Assessment",
      progress: 45,
      status: "blocked",
      daysInStage: 7,
      nextAction: "Waiting for lab results",
      assignedTo: "PT Anderson",
      priority: "high",
      stages: [
        { name: "Initial Review", status: "completed", date: "2024-11-10" },
        { name: "Documentation", status: "completed", date: "2024-11-13" },
        { name: "Medical Assessment", status: "blocked", date: "2024-11-16" },
        { name: "Care Plan Review", status: "pending", date: null },
        { name: "Final Approval", status: "pending", date: null },
        { name: "Onboarding", status: "pending", date: null },
      ],
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        )
      case "under_review":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Under Review
          </Badge>
        )
      case "blocked":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Blocked
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
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

  const getStageIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "blocked":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
    }
  }

  const filteredWorkflows = patientWorkflows.filter((workflow) => {
    const matchesSearch =
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || workflow.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
                  <BreadcrumbPage>Status Tracker</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Status Tracker</h1>
              <p className="text-muted-foreground">Monitor patient workflow progress and bottlenecks</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {patientWorkflows.filter((w) => w.status !== "completed").length}
                </div>
                <p className="text-xs text-muted-foreground">Currently in progress</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {patientWorkflows.filter((w) => w.status === "completed").length}
                </div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blocked</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {patientWorkflows.filter((w) => w.status === "blocked").length}
                </div>
                <p className="text-xs text-muted-foreground">Needs attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12 days</div>
                <p className="text-xs text-muted-foreground">From intake to onboarding</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Patient Workflow Status</CardTitle>
              <CardDescription>Track each patient's progress through the care admission process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {filteredWorkflows.map((workflow) => (
                  <Card key={workflow.id} className="p-4">
                    <div className="space-y-4">
                      {/* Patient Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`/placeholder-user.jpg`} />
                            <AvatarFallback>
                              {workflow.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{workflow.name}</h3>
                            <p className="text-sm text-muted-foreground">{workflow.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getPriorityBadge(workflow.priority)}
                          {getStatusBadge(workflow.status)}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress: {workflow.currentStage}</span>
                          <span>{workflow.progress}% Complete</span>
                        </div>
                        <Progress value={workflow.progress} className="h-2" />
                      </div>

                      {/* Workflow Stages */}
                      <div className="flex items-center justify-between">
                        {workflow.stages.map((stage, index) => (
                          <div key={index} className="flex flex-col items-center space-y-1 flex-1">
                            <div className="flex items-center">
                              {getStageIcon(stage.status)}
                              {index < workflow.stages.length - 1 && (
                                <div
                                  className={`w-full h-0.5 ml-2 ${
                                    stage.status === "completed" ? "bg-green-600" : "bg-gray-300"
                                  }`}
                                />
                              )}
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-medium">{stage.name}</p>
                              {stage.date && <p className="text-xs text-muted-foreground">{stage.date}</p>}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Current Status Info */}
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{workflow.assignedTo}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{workflow.daysInStage} days in stage</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileText className="h-3 w-3" />
                            <span>{workflow.nextAction}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
      <FloatingSidebarToggle />
    </>
  )
}
