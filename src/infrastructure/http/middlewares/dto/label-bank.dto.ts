import { z } from "zod";

export const createBankDTO = z.object({
  title: z.string(),
});

export const createLabelDTO = z.object({
  title: z.string(),
});

export const editBankDTO = z.object({
  title: z.string(),
});

export const editLabelDTO = z.object({
  title: z.string(),
});
