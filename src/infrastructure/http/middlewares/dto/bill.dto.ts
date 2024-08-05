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
  expiration_date: z.string().optional(),
  igv: z.number().default(0.18),
  bill_status_payment: z.enum(["CONTADO", "CREDITO"]),
  currency_code: z.enum(["PEN", "USD"]),

  exchange_rate: z.number(),
  products: z.array(
    z.object({
      title: z.string(),
      amount: z.number(),
      price: z.number(),
      unit_measure: z.string(),
      supplier_id: z.number(),
    })
  ),
});

export const getBillsDTO = z.object({
  year: z.number(),
  month: z.number(),
});
