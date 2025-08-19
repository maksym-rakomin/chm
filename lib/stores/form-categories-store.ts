import {create} from 'zustand'
import {getFormCategoriesAll} from '@/lib/actions/forms'

// Form category type from the existing types
type FormCategory = {
  id: string;
  name: string;
  type: string;
  created_at: string;
  updated_at: string;
  form_configurations: any[];
}

// Store state interface
interface FormCategoriesState {
  categories: FormCategory[]
  categoriesById: Record<string, string>
  isLoading: boolean
  error: string | null
  fetchCategories: () => Promise<void>
  clearError: () => void
}

export const useFormCategoriesStore = create<FormCategoriesState>((set, get) => ({
  categories: [],
  categoriesById: {},
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    try {
      set({isLoading: true, error: null})

      const response = await getFormCategoriesAll()
      const categories = response.data || []

      // Create categoriesById lookup object
      const categoriesById = categories.reduce<Record<string, string>>((acc, category) => {
        acc[String(category.id)] = category.name
        return acc
      }, {})

      set({
        categories,
        categoriesById,
        isLoading: false,
        error: null
      })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch categories'
      })
    }
  },

  clearError: () => set({error: null})
}))
