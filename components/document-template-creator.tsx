"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Plus,
  Trash2,
  GripVertical,
  Type,
  Calendar,
  CheckSquare,
  FileText,
  FilePenLineIcon as Signature,
  Hash,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface FormField {
  id: string
  type: "text" | "textarea" | "date" | "checkbox" | "select" | "signature" | "number"
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
}

export function DocumentTemplateCreator() {
  const [templateName, setTemplateName] = useState("")
  const [templateDescription, setTemplateDescription] = useState("")
  const [templateCategory, setTemplateCategory] = useState("")
  const [fields, setFields] = useState<FormField[]>([])

  const fieldTypes = [
    { value: "text", label: "Text Input", icon: Type },
    { value: "textarea", label: "Text Area", icon: FileText },
    { value: "date", label: "Date", icon: Calendar },
    { value: "checkbox", label: "Checkbox", icon: CheckSquare },
    { value: "select", label: "Dropdown", icon: CheckSquare },
    { value: "number", label: "Number", icon: Hash },
    { value: "signature", label: "Signature", icon: Signature },
  ]

  const addField = (type: FormField["type"]) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `New ${type} field`,
      required: false,
      placeholder: type === "text" || type === "textarea" ? "Enter text..." : undefined,
      options: type === "select" ? ["Option 1", "Option 2"] : undefined,
    }
    setFields([...fields, newField])
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, ...updates } : field)))
  }

  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id))
  }

  const renderFieldPreview = (field: FormField) => {
    switch (field.type) {
      case "text":
        return <Input placeholder={field.placeholder} disabled />
      case "textarea":
        return <Textarea placeholder={field.placeholder} disabled />
      case "date":
        return <Input type="date" disabled />
      case "checkbox":
        return <Checkbox disabled />
      case "select":
        return (
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
          </Select>
        )
      case "number":
        return <Input type="number" placeholder={field.placeholder} disabled />
      case "signature":
        return (
          <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center text-gray-500">
            Signature Area
          </div>
        )
      default:
        return <Input disabled />
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Document Template</DialogTitle>
          <DialogDescription>Build a custom template for documents and forms</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Template Builder */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Template Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Enter template name"
                  />
                </div>
                <div>
                  <Label htmlFor="template-description">Description</Label>
                  <Textarea
                    id="template-description"
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    placeholder="Describe the template purpose"
                  />
                </div>
                <div>
                  <Label htmlFor="template-category">Category</Label>
                  <Select value={templateCategory} onValueChange={setTemplateCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assessments">Assessments</SelectItem>
                      <SelectItem value="care-plans">Care Plans</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="notes">Notes</SelectItem>
                      <SelectItem value="forms">Forms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Add Fields</CardTitle>
                <CardDescription>Click to add different field types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {fieldTypes.map((fieldType) => (
                    <Button
                      key={fieldType.value}
                      variant="outline"
                      size="sm"
                      onClick={() => addField(fieldType.value as FormField["type"])}
                      className="justify-start"
                    >
                      <fieldType.icon className="mr-2 h-4 w-4" />
                      {fieldType.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Field Configuration */}
            {fields.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Field Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-gray-400" />
                          <Badge variant="outline">{field.type}</Badge>
                          <span className="text-sm font-medium">Field {index + 1}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeField(field.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Field Label</Label>
                          <Input
                            value={field.label}
                            onChange={(e) => updateField(field.id, { label: e.target.value })}
                          />
                        </div>
                        {(field.type === "text" || field.type === "textarea" || field.type === "number") && (
                          <div>
                            <Label>Placeholder</Label>
                            <Input
                              value={field.placeholder || ""}
                              onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                            />
                          </div>
                        )}
                      </div>

                      {field.type === "select" && (
                        <div>
                          <Label>Options (one per line)</Label>
                          <Textarea
                            value={field.options?.join("\n") || ""}
                            onChange={(e) =>
                              updateField(field.id, {
                                options: e.target.value.split("\n").filter((opt) => opt.trim()),
                              })
                            }
                            placeholder="Option 1&#10;Option 2&#10;Option 3"
                          />
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`required-${field.id}`}
                          checked={field.required}
                          onCheckedChange={(checked) => updateField(field.id, { required: checked as boolean })}
                        />
                        <Label htmlFor={`required-${field.id}`}>Required field</Label>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Template Preview</CardTitle>
                <CardDescription>Preview how your template will look to users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg min-h-[400px]">
                  {templateName && (
                    <div className="border-b pb-2">
                      <h3 className="text-lg font-semibold">{templateName}</h3>
                      {templateDescription && <p className="text-sm text-muted-foreground">{templateDescription}</p>}
                    </div>
                  )}

                  {fields.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>Add fields to see preview</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <div key={field.id} className="space-y-2">
                          <Label className="flex items-center gap-1">
                            {field.label}
                            {field.required && <span className="text-red-500">*</span>}
                          </Label>
                          {renderFieldPreview(field)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button className="flex-1">Save Template</Button>
              <Button variant="outline">Save as Draft</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
