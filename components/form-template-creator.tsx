"use client"

import {useEffect, useMemo, useState} from "react"
import {Button} from "@/components/ui/button"
import {Plus,} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {useFormCategoriesStore} from "@/lib/stores/form-categories-store"
import {useFormTemplateDraftStore} from "@/lib/stores/form-template-draft-store"
import {postFormConfigurations, updateFormConfigurations} from "@/lib/actions/forms"
import type {RequestFormSchema, FormConfigurationsListResponse} from "@/lib/types/forms"
import dynamic from "next/dynamic";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {useQueryClient} from "@tanstack/react-query";
import {GET_FORMS_CONFIGURATION_ALL} from "@/lib/constants/form";

const CustomFormBuilder = dynamic(
  () => import('@/app/(dashboard)/settings/_components/form-builder'),
  {ssr: false}
);

type EditForm = FormConfigurationsListResponse['data'][number] | null

interface FormTemplateCreatorProps {
  open?: boolean | undefined
  onOpenChange?: (open: boolean) => void | undefined
  mode?: 'create' | 'edit'
  formToEdit?: EditForm
}

type StatusOption = { label: string; value: 'draft' | 'active' | 'archived' }
const STATUS_OPTIONS: StatusOption[] = [
  { label: 'Draft', value: 'draft' },
  { label: 'Active', value: 'active' },
  { label: 'Archived', value: 'archived' },
]

export function FormTemplateCreator({open, onOpenChange, mode = 'create', formToEdit = null}: FormTemplateCreatorProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [metaOpen, setMetaOpen] = useState(false)
  const [builderOpen, setBuilderOpen] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; category?: string; status?: string }>({})
  const [initialFormSchema, setInitialFormSchema] = useState<any>({ components: [] })
  const queryClient = useQueryClient()

  const isControlled = open !== undefined
  const flowOpen = isControlled ? (open as boolean) : internalOpen
  const startFlow = () => {
    if (!isControlled) setInternalOpen(true)
    setErrors({})

    // Prefill draft/meta in edit mode
    if (mode === 'edit' && formToEdit) {
      const parsedSchema = safeParseSchema(formToEdit.form_schema)
      setInitialFormSchema(parsedSchema ?? { components: [] })
      setMeta({
        name: formToEdit.name ?? '',
        description: formToEdit.description ?? null,
        status: (formToEdit.status as any) ?? 'draft',
        form_category_id: Number(formToEdit.form_category_id) || null,
      })
    } else {
      setInitialFormSchema({ components: [] })
      reset() // ensure clean draft for create
    }

    setMetaOpen(true)
    setBuilderOpen(false)
  }
  const endFlow = () => {
    onOpenChange?.(false)
    if (!isControlled) setInternalOpen(false)
    setErrors({})
    setMetaOpen(false)
    setBuilderOpen(false)
  }
  const handleFlowOpenChange = (value: boolean) => {
    if (value) {
      startFlow()
    } else {
      endFlow()
    }
  }

  const { categories, isLoading: categoriesLoading } = useFormCategoriesStore()
  const { draft, setMeta, setSchema, reset } = useFormTemplateDraftStore()

  // When flow becomes open from outside, open the meta dialog
  useEffect(() => {
    if (flowOpen) {
      startFlow()
    } else {
      // flow closed from outside
      setMetaOpen(false)
      setBuilderOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowOpen])

  // Local controlled inputs for step 1, derive initial values from store
  const [name, setName] = useState(draft.name)
  const [description, setDescription] = useState(draft.description ?? '')
  const [status, setStatus] = useState<'draft'|'active'|'archived'>(draft.status)
  const [categoryId, setCategoryId] = useState<string>(
    draft.form_category_id ? String(draft.form_category_id) : ''
  )

  // Reset form inputs when metadata dialog opens
  useEffect(() => {
    if (metaOpen) {
      // In edit mode, pull from formToEdit; otherwise from draft
      if (mode === 'edit' && formToEdit) {
        setName(formToEdit.name ?? '')
        setDescription(formToEdit.description ?? '')
        setStatus((formToEdit.status as any) ?? 'draft')
        setCategoryId(String(formToEdit.form_category_id ?? ''))
      } else {
        setName(draft.name)
        setDescription(draft.description ?? '')
        setStatus(draft.status)
        setCategoryId(draft.form_category_id ? String(draft.form_category_id) : '')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metaOpen, mode, formToEdit])

  const categoryOptions = useMemo(() => (
    categories.map(c => ({ value: String(c.id), label: c.name }))
  ), [categories])

  const validateStep1 = () => {
    const errs: typeof errors = {}
    if (!name.trim()) errs.name = 'Name is required'
    if (!categoryId) errs.category = 'Category is required'
    if (!status) errs.status = 'Status is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (!validateStep1()) return
    setMeta({
      name: name.trim(),
      description: description.trim() ? description.trim() : null,
      status,
      form_category_id: Number(categoryId),
    })
    // switch dialogs: close meta, open builder
    setMetaOpen(false)
    setBuilderOpen(true)
  }

  const handleCancel = () => {
    reset()
    endFlow()
  }

  const buildPayload = (schema: any): RequestFormSchema => {
    return {
      form_category_id: Number(draft.form_category_id ?? categoryId),
      name: draft.name || name.trim(),
      description: (draft.description ?? (description.trim() ? description.trim() : null)) as string | null,
      status: draft.status || status,
      form_schema: Array.isArray(schema) ? schema : [JSON.stringify(schema)],
    }
  }

  const handleSaveSchema = async (schema: any) => {
    try {
      setSchema(schema)
      const payload = buildPayload(schema)

      if (mode === 'edit' && formToEdit) {
        await updateFormConfigurations(Number(formToEdit.id), payload)
      } else {
        await postFormConfigurations(payload)
      }

      reset()
      endFlow()
    } catch (e) {
      console.error('Failed to save form configuration', e)
    } finally {
      await queryClient.invalidateQueries({queryKey: [GET_FORMS_CONFIGURATION_ALL]});
    }
  }

  const titleMeta = mode === 'edit' ? 'Edit Form Details' : 'New Form Details'
  const titleBuilder = mode === 'edit' ? 'Edit Document Template' : 'Create Document Template'

  return (
    <>
      {/* Flow trigger for uncontrolled usage */}
      <Dialog open={flowOpen} onOpenChange={handleFlowOpenChange}>
        {(open === undefined && onOpenChange === undefined) ?? (
          <DialogTrigger asChild>
            <Button onClick={() => handleFlowOpenChange(true)}>
              <Plus className="mr-2 h-4 w-4"/>
              {mode === 'edit' ? 'Edit Template' : 'Create Template'}
            </Button>
          </DialogTrigger>
        )}
      </Dialog>

      {/* Dialog 1: Metadata */}
      <Dialog open={metaOpen} onOpenChange={(v) => (v ? startFlow() : handleCancel())}>
        <DialogContent className="w-full max-w-2xl gap-2 flex flex-col items-start">
          <DialogHeader className="p-0">
            <DialogTitle>{titleMeta}</DialogTitle>
            <DialogDescription>
              {mode === 'edit' ? 'Update the basic information of your form' : 'Enter basic information before building the form'}
            </DialogDescription>
          </DialogHeader>

          <div className="w-full pt-0">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Form Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId} disabled={categoriesLoading}>
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder={categoriesLoading ? 'Loading categories...' : 'Select category'} />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter form name" />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleNext}>Next</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog 2: Builder */}
      <Dialog open={builderOpen} onOpenChange={(v) => (v ? setBuilderOpen(true) : handleCancel())}>
        <DialogContent className="w-full h-full max-w-full p-0 border-none sm:rounded-none gap-2 flex flex-col items-start">
          <DialogHeader className="p-4">
            <DialogTitle>{titleBuilder}</DialogTitle>
            <DialogDescription>
              {mode === 'edit' ? 'Modify the template structure' : 'Build a custom template for documents and forms'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 w-full flex flex-col">
            <CustomFormBuilder
              setVisibleDialog={(visible) => (visible ? setBuilderOpen(true) : handleCancel())}
              onSave={handleSaveSchema}
              onCancel={handleCancel}
              initialForm={initialFormSchema}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function safeParseSchema(raw: string | any): any {
  if (!raw) return { components: [] }
  if (typeof raw !== 'string') return raw
  try {
    const parsed = JSON.parse(raw)
    return parsed ?? { components: [] }
  } catch {
    return { components: [] }
  }
}
