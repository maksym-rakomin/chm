"use client"
import { useRoleGuard } from "@/lib/hooks/useRoleGuard"
import React from "react"
import { Plus, FileText, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DocumentViewer } from "@/components/document-viewer"
import { DocumentTemplateCreator } from "@/components/document-template-creator"

const templates = [
  {
    id: "1",
    name: "Invoice Template",
    description: "A standard invoice template for billing clients.",
    category: "Finance",
    usage: 25,
    lastUpdated: "2023-11-15",
  },
  {
    id: "2",
    name: "Meeting Agenda",
    description: "Template for structuring meeting agendas.",
    category: "Meetings",
    usage: 18,
    lastUpdated: "2023-11-20",
  },
  {
    id: "3",
    name: "Project Proposal",
    description: "Template for creating project proposals.",
    category: "Projects",
    usage: 32,
    lastUpdated: "2023-11-25",
  },
]

const documents = [
  {
    id: "doc1",
    name: "Client Invoice",
    type: "Invoice",
    status: "Sent",
    lastUpdated: "2023-12-01",
  },
  {
    id: "doc2",
    name: "Project Plan",
    type: "Plan",
    status: "Draft",
    lastUpdated: "2023-12-05",
  },
  {
    id: "doc3",
    name: "Meeting Notes",
    type: "Notes",
    status: "Completed",
    lastUpdated: "2023-12-10",
  },
]

export default function DocumentsPage() {
  useRoleGuard()
  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="documents" className="w-[100%]">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="documents">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Documents</h2>
            <Button>Create New Document</Button>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Search Documents</CardTitle>
                <CardDescription>Find documents by name, type, or status.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Document Name" />
                    </div>
                    <div className="col-span-1">
                      <Label htmlFor="type">Type</Label>
                      <Input id="type" placeholder="Document Type" />
                    </div>
                    <div className="col-span-1">
                      <Label htmlFor="status">Status</Label>
                      <Input id="status" placeholder="Document Status" />
                    </div>
                  </div>
                  <Button>Search</Button>
                </div>
              </CardContent>
            </Card>

            <Table>
              <TableCaption>A list of your recent documents.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>{doc.status}</TableCell>
                    <TableCell>{doc.lastUpdated}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <DocumentViewer document={doc} />
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Download</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your document from our
                                    servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>Total Documents: {documents.length}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="templates">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Document Templates</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <FileText className="h-8 w-8 text-green-600" />
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Usage:</span>
                      <span className="font-medium">{template.usage} times</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Updated:</span>
                      <span className="text-muted-foreground">{template.lastUpdated}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="flex-1">
                        <Plus className="mr-1 h-3 w-3" />
                        Use Template
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add Template Creator Card */}
            <Card className="border-dashed border-2 hover:border-solid hover:shadow-md transition-all cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                <Plus className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="font-medium mb-2">Create New Template</h3>
                <p className="text-sm text-muted-foreground mb-4">Build a custom document template</p>
                <DocumentTemplateCreator />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Settings</h2>
          </div>
          {/* Settings content here */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
