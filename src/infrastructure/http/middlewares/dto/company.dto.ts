import { z } from "zod";

export const createCompanyDTO = z.object({
  business_name: z.string(),
  business_type: z.string(),
  business_status: z.string(),
  business_direction_fiscal: z.string(),
  phone: z.string().optional(),
  country_code: z.string().optional(),
  user: z.string(),
  ruc: z.string().min(11),
  key: z.string(),
  client_id: z.string().optional(),
  client_secret: z.string().optional(),
});

export const updateCompanyDTO = z.object({
  business_name: z.string(),
  business_type: z.string(),
  business_status: z.string(),
  business_direction_fiscal: z.string(),
  phone: z.string().optional(),
  country_code: z.string().optional(),
  user: z.string().optional(),
  ruc: z.string().min(11),
  key: z.string(),
  client_id: z.string().optional(),
  client_secret: z.string().optional(),
});

export const deleteCompanyDTO = z.object({
  password: z.string(),
});

export const validateRuc = z.object({
  ruc: z.string().min(11),
});
