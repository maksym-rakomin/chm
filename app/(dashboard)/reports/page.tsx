"use client"
import { useRoleGuard } from "@/lib/hooks/useRoleGuard"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { BarChart3, Download, Calendar, Users, FileText, TrendingUp, Menu, Eye, Share } from "lucide-react"
import { FloatingSidebarToggle } from "@/components/floating-sidebar-toggle"
import { useSidebarVisibility } from "@/components/sidebar-context"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"

export default function ReportsPage() {
  useRoleGuard()
  const [dateRange, setDateRange] = useState("last_30_days")
  const [reportType, setReportType] = useState("all")
  const { isVisible, showSidebar } = useSidebarVisibility()

  const reportCategories = [
    {
      title: "Patient Reports",
      description: "Admission, discharge, and patient status analytics",
      icon: Users,
      color: "bg-blue-100 text-blue-800",
      reports: [
        { name: "Patient Admission Report", description: "Monthly admission statistics", lastGenerated: "2024-12-01" },
        {
          name: "Patient Status Summary",
          description: "Current patient status breakdown",
          lastGenerated: "2024-12-02",
        },
        { name: "Discharge Analysis", description: "Discharge patterns and outcomes", lastGenerated: "2024-11-28" },
        { name: "Length of Stay Report", description: "Average stay duration analysis", lastGenerated: "2024-11-30" },
      ],
    },
    {
      title: "Operational Reports",
      description: "Staff performance, capacity, and workflow metrics",
      icon: BarChart3,
      color: "bg-green-100 text-green-800",
      reports: [
        {
          name: "Staff Utilization Report",
          description: "Staff workload and efficiency metrics",
          lastGenerated: "2024-12-01",
        },
        {
          name: "Capacity Analysis",
          description: "Bed occupancy and availability trends",
          lastGenerated: "2024-12-02",
        },
        {
          name: "Workflow Efficiency",
          description: "Process bottlenecks and completion times",
          lastGenerated: "2024-11-29",
        },
        { name: "Quality Metrics", description: "Care quality indicators and compliance", lastGenerated: "2024-11-30" },
      ],
    },
    {
      title: "Financial Reports",
      description: "Revenue, costs, and billing analytics",
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-800",
      reports: [
        { name: "Revenue Analysis", description: "Monthly revenue and billing summary", lastGenerated: "2024-12-01" },
        { name: "Cost Center Report", description: "Department-wise cost breakdown", lastGenerated: "2024-11-30" },
        { name: "Insurance Claims", description: "Claims processing and reimbursement", lastGenerated: "2024-12-02" },
        { name: "Budget vs Actual", description: "Budget performance analysis", lastGenerated: "2024-11-28" },
      ],
    },
    {
      title: "Compliance Reports",
      description: "Regulatory compliance and audit reports",
      icon: FileText,
      color: "bg-orange-100 text-orange-800",
      reports: [
        {
          name: "Regulatory Compliance",
          description: "HIPAA and healthcare regulation compliance",
          lastGenerated: "2024-12-01",
        },
        { name: "Documentation Audit", description: "Patient record completeness audit", lastGenerated: "2024-11-29" },
        {
          name: "Staff Certification",
          description: "Staff training and certification status",
          lastGenerated: "2024-12-02",
        },
        {
          name: "Incident Reports",
          description: "Safety incidents and corrective actions",
          lastGenerated: "2024-11-30",
        },
      ],
    },
  ]

  // Sample chart data
  const patientStatusData = [
    { name: "Under Review", value: 12, color: "#3b82f6" },
    { name: "Accepted", value: 8, color: "#10b981" },
    { name: "Rejected", value: 3, color: "#ef4444" },
    { name: "Onboarded", value: 45, color: "#8b5cf6" },
    { name: "Discharged", value: 15, color: "#6b7280" },
  ]

  const admissionTrendData = [
    { month: "Jul", admissions: 12, discharges: 8 },
    { month: "Aug", admissions: 15, discharges: 10 },
    { month: "Sep", admissions: 18, discharges: 12 },
    { month: "Oct", admissions: 22, discharges: 14 },
    { month: "Nov", admissions: 20, discharges: 16 },
    { month: "Dec", admissions: 25, discharges: 18 },
  ]

  const quickStats = [
    { title: "Total Reports", value: "156", change: "+12%", icon: FileText },
    { title: "Generated This Month", value: "24", change: "+8%", icon: Calendar },
    { title: "Scheduled Reports", value: "8", change: "0%", icon: BarChart3 },
    { title: "Compliance Score", value: "98%", change: "+2%", icon: TrendingUp },
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
                  <BreadcrumbLink href="/public">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Reports</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
              <p className="text-muted-foreground">Generate insights and track performance metrics</p>
            </div>
            <div className="flex gap-2">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_7_days">Last 7 days</SelectItem>
                  <SelectItem value="last_30_days">Last 30 days</SelectItem>
                  <SelectItem value="last_90_days">Last 90 days</SelectItem>
                  <SelectItem value="last_year">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export All
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickStats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
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

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Patient Status Distribution</CardTitle>
                <CardDescription>Current patient status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: "Patients",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={patientStatusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {patientStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Admission & Discharge Trends</CardTitle>
                <CardDescription>Monthly patient flow patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    admissions: {
                      label: "Admissions",
                      color: "hsl(var(--chart-1))",
                    },
                    discharges: {
                      label: "Discharges",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={admissionTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="admissions" fill="var(--color-admissions)" name="Admissions" />
                      <Bar dataKey="discharges" fill="var(--color-discharges)" name="Discharges" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Report Categories */}
          <div className="space-y-6">
            {reportCategories.map((category) => (
              <Card key={category.title}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <category.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle>{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    {category.reports.map((report) => (
                      <div key={report.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <h4 className="font-medium">{report.name}</h4>
                          <p className="text-sm text-muted-foreground">{report.description}</p>
                          <p className="text-xs text-muted-foreground">Last generated: {report.lastGenerated}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </SidebarInset>
      <FloatingSidebarToggle />
    </>
  )
}
