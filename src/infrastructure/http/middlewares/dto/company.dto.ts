import { z } from "zod";

export const createCompanyDTO = z.object({
  business_name: z.string(),
  business_type: z.string().optional(),
  business_status: z.string().optional(),
  business_direction_fiscal: z.string().optional(),
  business_user: z.string(),
  phone: z.string().optional(),
  country_code: z.string().optional(),
  ruc: z.string(),
  key: z.string(),
});

export const updateCompanyDTO = z.object({
  business_name: z.string(),
  business_type: z.string().optional(),
  business_status: z.string().optional(),
  business_direction_fiscal: z.string().optional(),
  business_user: z.string().optional(),
  phone: z.string().optional(),
  country_code: z.string().optional(),
  ruc: z.string(),
  key: z.string(),
});

export const validateRuc = z.object({
  ruc: z.string().min(11),
});
