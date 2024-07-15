import { z } from "zod";

export const createCompanyDTO = z.object({
  business_name: z.string(),
  description: z.string().optional(),
  ruc: z.string(),
  key: z.string(),
});

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export const registerImageSchema = z.object({
  "company-profile": z
    .instanceof(Buffer)
    .refine(
      (data) => {
        return data.length > 0;
      },
      {
        message: "File is required",
      }
    )
    .refine(
      (data) => {
        return data.length <= MAX_FILE_SIZE;
      },
      {
        message: `File size should be less than ${
          MAX_FILE_SIZE / 1024 / 1024
        }MB`,
      }
    ),
});
