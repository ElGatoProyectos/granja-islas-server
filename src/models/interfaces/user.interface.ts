export interface Init {
  name: string;
  last_name: string;
  phone: string;
  email: string;
  dni: string;
  ruc: string;
  key: string;
}

export interface I_CreateUser extends Init {
  password: string;
}

export interface I_UpdateUser extends Init {
  password?: string;
  role: string;
  status_enabled: boolean;
}
