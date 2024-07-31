import { z } from "zod";

export const validateCredentialsDTO = z.object({
  ruc: z.string().min(11),
  token: z.string(),
});
