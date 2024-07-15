import { z } from "zod";

export const authDTO = z.object({
  credential: z.string(),
  password: z.string(),
});

export const jwtDecodeDTO = z.object({
  id: z.number(),
  role: z.enum(["SUPERADMIN", "ADMIN", "USER"]),
  full_name: z.string(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});
