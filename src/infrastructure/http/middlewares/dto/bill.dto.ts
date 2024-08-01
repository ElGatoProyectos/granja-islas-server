import { z } from "zod";

export const createBillDTO = z.object({
  num_serie: z.string(),
  num_cpe: z.number(),
  code: z.string(),
  date: z.string(),
  period: z.string().optional(),
  total: z.number(),
  bill_status: z.string(),
  supplier_id: z.number(),
});

export const getBillsDTO = z.object({
  year: z.number(),
  month: z.number(),
});
