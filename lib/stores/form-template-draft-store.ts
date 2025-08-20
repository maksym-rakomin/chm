import { create } from 'zustand'

export type FormTemplateStatus = 'draft' | 'active' | 'archived'

export type FormTemplateDraft = {
  form_category_id: number | null
  name: string
  description: string | null
  status: FormTemplateStatus
  form_schema: any | null
}

interface FormTemplateDraftState {
  draft: FormTemplateDraft
  setMeta: (meta: Partial<Omit<FormTemplateDraft, 'form_schema'>>) => void
  setSchema: (schema: any) => void
  reset: () => void
}

const initialDraft: FormTemplateDraft = {
  form_category_id: null,
  name: '',
  description: null,
  status: 'draft',
  form_schema: null,
}

export const useFormTemplateDraftStore = create<FormTemplateDraftState>((set) => ({
  draft: initialDraft,
  setMeta: (meta) => set((state) => ({ draft: { ...state.draft, ...meta } })),
  setSchema: (schema) => set((state) => ({ draft: { ...state.draft, form_schema: schema } })),
  reset: () => set({ draft: initialDraft }),
}))
