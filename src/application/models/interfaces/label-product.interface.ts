import { Product_Label } from "@prisma/client";

export interface I_CreateLabel
  extends Omit<Product_Label, "id" | "status_deleted"> {}

export interface I_UpdateLabel
  extends Omit<Product_Label, "id" | "status_deleted"> {}
