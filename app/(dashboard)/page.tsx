"use client"
import { useRoleGuard } from "@/lib/hooks/useRoleGuard"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { FloatingSidebarToggle } from "@/components/floating-sidebar-toggle"
import { Users, UserCheck, Calendar, FileText, Menu } from "lucide-react"
import { useSidebarVisibility } from "@/components/sidebar-context"

export default function Dashboard() {
  useRoleGuard()
  const { isVisible, showSidebar } = useSidebarVisibility()

  const stats = [
    {
      title: "Active Patients",
      value: "247",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Staff Members",
      value: "89",
      change: "+3%",
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      title: "Today's Appointments",
      value: "34",
      change: "-2%",
      icon: Calendar,
      color: "text-purple-600",
    },
    {
      title: "Pending Documents",
      value: "18",
      change: "-8%",
      icon: FileText,
      color: "text-orange-600",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: "patient_admitted",
      message: "New patient Sarah Johnson admitted to Memory Care program",
      time: "2 hours ago",
      status: "success",
    },
    {
      id: 2,
      type: "assessment_due",
      message: "Quarterly assessment due for Michael Brown",
      time: "4 hours ago",
      status: "warning",
    },
    {
      id: 3,
      type: "staff_onboarded",
      message: "New nurse practitioner Lisa Chen completed onboarding",
      time: "1 day ago",
      status: "success",
    },
    {
      id: 4,
      type: "document_missing",
      message: "Missing care plan for Robert Wilson",
      time: "2 days ago",
      status: "error",
    },
  ]

  const upcomingTasks = [
    {
      id: 1,
      task: "Complete intake assessment for new patient",
      assignee: "Dr. Smith",
      dueDate: "Today, 3:00 PM",
      priority: "high",
    },
    {
      id: 2,
      task: "Review medication list for Room 204",
      assignee: "Nurse Johnson",
      dueDate: "Tomorrow, 9:00 AM",
      priority: "medium",
    },
    {
      id: 3,
      task: "Update care plan documentation",
      assignee: "Case Manager Davis",
      dueDate: "Friday, 2:00 PM",
      priority: "low",
    },
  ]

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
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className={stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}>
                      {stat.change}
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest updates across your organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.status === "success"
                            ? "bg-green-500"
                            : activity.status === "warning"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{activity.message}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Tasks requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{task.task}</p>
                        <Badge
                          variant={
                            task.priority === "high"
                              ? "destructive"
                              : task.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{task.assignee}</span>
                        <span>{task.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Patient Status Overview</CardTitle>
                <CardDescription>Current patient lifecycle distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Active Care</span>
                    <span>180 patients</span>
                  </div>
                  <Progress value={73} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Intake Process</span>
                    <span>45 patients</span>
                  </div>
                  <Progress value={18} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Discharge Planning</span>
                    <span>22 patients</span>
                  </div>
                  <Progress value={9} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button variant="outline" className="justify-start bg-transparent">
                  <Users className="mr-2 h-4 w-4" />
                  Add New Patient
                </Button>
                <Button variant="outline" className="justify-start bg-transparent">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Onboard Staff Member
                </Button>
                <Button variant="outline" className="justify-start bg-transparent">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Button>
                <Button variant="outline" className="justify-start bg-transparent">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
      <FloatingSidebarToggle />
    </>
  )
}
