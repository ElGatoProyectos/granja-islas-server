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

export const newFormatBillDTO = z.object({
  code: z.string(),
  supplier_id: z.number(),
  issue_date: z.string(),
  igv: z.number().default(0.18),
  expiration_date: z.string().optional(),
  // total: z.number(),
  bill_status_payment: z.enum(["CONTADO", "CREDITO"]),
});

export const getBillsDTO = z.object({
  year: z.number(),
  month: z.number(),
});
