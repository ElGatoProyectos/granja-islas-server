import { z } from "zod";

export const createUserDTO = z.object({
  role: z.enum(["ADMIN", "USER"]),
  name: z.string(),
  last_name: z.string(),
  phone: z.string().optional(),
  email: z.string().email(),
  dni: z.string(),
});

export const editUserDTO = z.object({
  role: z.enum(["ADMIN", "USER"]),
  name: z.string(),
  last_name: z.string(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  dni: z.string(),
});

export const createSunatDTO = z.object({
  ruc: z.string(),
  key: z.string(),
});

export const updateUserDTO = createUserDTO.partial();
