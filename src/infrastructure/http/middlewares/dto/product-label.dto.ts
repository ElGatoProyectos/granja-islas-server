import { z } from "zod";

export const assignLabel = z.object({
  label_id: z.number(),
});
