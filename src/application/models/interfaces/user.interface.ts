import { User } from "@prisma/client";

export interface I_User_Init {
  name: string;
  last_name: string;
  phone: string;
  email: string;
  dni: string;
  ruc: string;
  key: string;
}

// export interface I_CreateUser extends I_User_Init {
//   password: string;
// }

// export interface I_UpdateUser extends I_User_Init {
//   password?: string;
//   role: string;
//   status_enabled: boolean;
// }

export interface I_CreateUser
  extends Omit<User, "id" | "role" | "created_at" | "updated_at"> {}

export interface I_UpdateUser
  extends Omit<User, "id" | "created_at" | "updated_at"> {}
