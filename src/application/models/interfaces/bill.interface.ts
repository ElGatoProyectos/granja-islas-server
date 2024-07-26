import { Bill } from "@prisma/client";

export interface I_CreateBill
  extends Omit<Bill, "id" | "created_at" | "updated_at"> {}
