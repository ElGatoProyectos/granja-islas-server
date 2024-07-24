import { User } from "@prisma/client";

export interface I_CreateUser
  extends Omit<User, "id" | "created_at" | "updated_at"> {}

export interface I_UpdateUser
  extends Omit<User, "id" | "created_at" | "updated_at"> {}
