import { Company } from "@prisma/client";

export interface I_UpdateCompany
  extends Omit<Company, "id" | "created_at" | "updated_at"> {}
