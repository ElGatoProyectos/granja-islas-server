import { z } from "zod";

export const createSupplierDTo = z.object({
  ruc: z.string(),
  business_name: z.string(),
  business_type: z.string(),
  business_status: z.string(),
  business_direction: z.string(),
});

export const updateSupplierDTo = z.object({
  ruc: z.string(),
  business_name: z.string(),
  business_type: z.string(),
  business_status: z.string(),
  business_direction: z.string(),
});
