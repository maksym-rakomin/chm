export type RequestFormSchema = {
  form_category_id: number;
  name: string;
  description: string | null;
  status: 'draft' | 'active' | 'archived';
  form_schema: string[];
};


type Permission = {
  id: string;
  name: string;
  guard_name: string;
  view_name: string;
  view_description: string;
  created_at: string;
  updated_at: string;
  roles: any[];
};

type Role = {
  id: string;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  permissions: Permission[];
};

type User = {
  id: string;
  role_id: string;
  role: Role;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at: string;
  invitation_sent_at: string;
  last_login_at: string;
  last_seen_at: string;
  created_at: string;
  updated_at: string;
};

type Patient = {
  id: string;
  treating_doctor_id: string;
  treating_doctor: User;
  first_name: string;
  last_name: string;
  status: string;
  email: string;
  contact_phone_number: string;
  created_at: string;
  updated_at: string;
};

type FormInstance = {
  id: string;
  form_configuration_id: string;
  form_configuration: any;
  treating_doctor_id: string;
  treating_doctor: User;
  patient_id: string;
  patient: Patient;
  status: string;
  form_schema: string;
  form_data: string;
  created_at: string;
  updated_at: string;
};

type FormConfiguration = {
  id: string;
  form_category_id: string;
  form_category: {
    id: string;
    name: string;
    type: string;
    created_at: string;
    updated_at: string;
    form_configurations: any[];
  };
  name: string;
  description: string;
  status: string;
  form_schema: string;
  created_at: string;
  updated_at: string;
  form_instances: FormInstance[];
};

export type FormApiResponse = {
  data: FormConfiguration;
  message: string;
  timestamp: string;
};

export type DeleteFormApiResponse = {
  "data": string,
  "message": string,
  "timestamp": string
}

export type FormConfigurationsListResponse = {
  data: FormConfiguration[];
  message: string;
  timestamp: string;
};


type Link = {
  url: string;
  label: string;
  active: boolean;
};

type Meta = {
  current_page: number;
  from: number;
  last_page: number;
  links: Link[];
  path: string;
  per_page: number;
  to: number;
  total: number;
};

type FormLinks = {
  first: string;
  last: string;
  prev: string;
  next: string;
};

export type PaginatedFormConfigurationsResponse = {
  data: FormConfiguration[];
  meta: Meta;
  links: FormLinks;
};



// form categories

type FormConfigurationForCategory = {
  id: string;
  form_category_id: string;
  form_category: any;
  name: string;
  description: string;
  status: string;
  form_schema: string;
  created_at: string;
  updated_at: string;
  form_instances: FormInstance[];
};

type FormCategory = {
  id: string;
  name: string;
  type: string;
  created_at: string;
  updated_at: string;
  form_configurations: FormConfigurationForCategory[];
};

export type FormCategoryResponse = {
  data: FormCategory[];
};
