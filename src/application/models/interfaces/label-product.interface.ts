import { ProductLabel } from "@prisma/client";

export interface I_CreateLabel
  extends Omit<ProductLabel, "id" | "status_deleted"> {}

export interface I_UpdateLabel
  extends Omit<ProductLabel, "id" | "status_deleted"> {}
