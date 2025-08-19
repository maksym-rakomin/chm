import {authFetch} from "@/lib/api/authClient";
import {
  DeleteFormApiResponse,
  FormApiResponse, FormCategoryResponse,
  FormConfigurationsListResponse, PaginatedFormConfigurationsResponse,
  RequestFormSchema
} from "@/lib/types/forms";

export const getFormConfigurationsAll = async (): Promise<FormConfigurationsListResponse> => {
  return await authFetch('/form-configurations/all')
}
export const getFormConfigurationsListPaginate = async (): Promise<PaginatedFormConfigurationsResponse> => {
  return await authFetch('/form-configurations')
}

export const getFormConfigurationsById = async (id: number): Promise<FormApiResponse> => {
  return await authFetch(`/form-configurations/${id}`)
}


export const postFormConfigurations = async (body: RequestFormSchema): Promise<FormApiResponse> => {
  return await authFetch('/form-configurations', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export const updateFormConfigurations = async (id: number, body: RequestFormSchema): Promise<FormApiResponse> => {
  return await authFetch(`/form-configurations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export const deleteFormConfigurations = async (id: number): Promise<DeleteFormApiResponse> => {
  return await authFetch(`/form-configurations/${id}`, {
    method: 'DELETE',
  })
}

/* forms categories */
export const getFormCategoriesAll = async (): Promise<FormCategoryResponse> => {
  return await authFetch('/form-categories/all')
}

