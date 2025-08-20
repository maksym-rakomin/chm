"use client"
import {useRoleGuard} from "@/lib/hooks/useRoleGuard"
import React, {useEffect, useMemo, useState} from "react"
import {Eye, FileText, Plus} from "lucide-react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {SidebarInset} from "@/components/ui/sidebar";
import {FloatingSidebarToggle} from "@/components/floating-sidebar-toggle";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Label} from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {Badge} from "@/components/ui/badge";
import {FormTemplateCreator} from "@/components/form-template-creator";
import Header from "@/components/header";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {GET_FORMS_CONFIGURATION_ALL} from "@/lib/constants/form";
import {deleteFormConfigurations, getFormConfigurationsAll} from "@/lib/actions/forms";
import {useFormCategoriesStore} from "@/lib/stores/form-categories-store";
import type {FormConfigurationsListResponse} from "@/lib/types/forms";

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

type FormItem = FormConfigurationsListResponse['data'][number]

export default function DocumentsPage() {
  useRoleGuard()

  const [isVisibleCreateTemplateDialog, setIsVisibleCreateTemplateDialog] = useState(false)
  const [isVisibleEditDialog, setIsVisibleEditDialog] = useState(false)
  const [formToEdit, setFormToEdit] = useState<FormItem | null>(null)
  const [formToDelete, setFormToDelete] = useState<FormItem | null>(null)

  const queryClient = useQueryClient()

  const formsSchemaList = useQuery({
    queryKey: [GET_FORMS_CONFIGURATION_ALL],
    queryFn: getFormConfigurationsAll,
  });

  const {categoriesById, isLoading: categoriesLoading, fetchCategories} = useFormCategoriesStore();

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const isLoading = formsSchemaList.isLoading || categoriesLoading

  const handleEdit = (form: FormItem) => {
    setFormToEdit(form)
    setIsVisibleEditDialog(true)
  }
  const handleDelete = (form: FormItem) => {
    setFormToDelete(form)
  }
  const confirmDelete = async () => {
    if (!formToDelete) return
    try {
      await deleteFormConfigurations(Number(formToDelete.id))
    } catch (e) {
      console.error('Failed to delete form', e)
    } finally {
      setFormToDelete(null)
      await queryClient.invalidateQueries({ queryKey: [GET_FORMS_CONFIGURATION_ALL] })
    }
  }

  const deleteDialogTitle = useMemo(() => `Delete form "${formToDelete?.name ?? ''}"?`, [formToDelete])

  return (
    <>
      <SidebarInset>
        <Header pageTitle="Form Template builder"/>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Form Template builder</h1>
              <p className="text-muted-foreground">
                Manage your documents, templates, and settings from one central location.
              </p>
            </div>
          </div>

          <Tabs defaultValue="forms" className="w-[100%]">
            <TabsList>
              <TabsTrigger value="forms">Forms</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="forms">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Your Forms</h2>
                <Button onClick={() => setIsVisibleCreateTemplateDialog(true)}>Create New Forms</Button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                    <span>Loading forms...</span>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Search Forms</CardTitle>
                      <CardDescription>Find forms by name, type, or status.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="col-span-1">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Form Name"/>
                          </div>
                          <div className="col-span-1">
                            <Label htmlFor="type">Type</Label>
                            <Input id="type" placeholder="Form Type"/>
                          </div>
                          <div className="col-span-1">
                            <Label htmlFor="status">Status</Label>
                            <Input id="status" placeholder="Form Status"/>
                          </div>
                        </div>
                        <Button>Search</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Table>
                    <TableCaption>A list of your recent forms.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Id</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formsSchemaList.data?.data?.map((form) => (
                        <TableRow key={form.id}>
                          <TableCell className="font-medium">{form.id}</TableCell>
                          <TableCell>{form.name}</TableCell>
                          <TableCell>
                            <Badge variant={form.status === 'active' ? 'default' : form.status === 'draft' ? 'secondary' : 'destructive'}>
                              {form.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{categoriesById[String(form.form_category_id)] ?? '—'}</TableCell>
                          <TableCell>{new Date(form.updated_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <Eye className="h-4 w-4"/>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(form)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(form)}>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                      }
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={6}>
                          Total Forms: {formsSchemaList.data?.data?.length || 0}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="templates">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Forms Templates</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <FileText className="h-8 w-8 text-green-600"/>
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
                            <Plus className="mr-1 h-3 w-3"/>
                            Use Template
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3"/>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Add Template Creator Card */}
                <Card className="border-dashed border-2 hover:border-solid hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                    <Plus className="h-12 w-12 text-gray-400 mb-4"/>
                    <h3 className="font-medium mb-2">Create New Template</h3>
                    <p className="text-sm text-muted-foreground mb-4">Build a custom document template</p>
                    <Button onClick={() => setIsVisibleCreateTemplateDialog(true)}>Create New Forms</Button>
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

        <FormTemplateCreator open={isVisibleCreateTemplateDialog} onOpenChange={setIsVisibleCreateTemplateDialog} mode="create" />
        <FormTemplateCreator open={isVisibleEditDialog} onOpenChange={(v) => { setIsVisibleEditDialog(v); if (!v) setFormToEdit(null); }} mode="edit" formToEdit={formToEdit} />

        <AlertDialog open={!!formToDelete}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{deleteDialogTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the form configuration.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setFormToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarInset>
      <FloatingSidebarToggle/>
    </>
  )
}
