import { z } from "zod";

export const cardIdParamSchema = z.object({
  id: z.string().uuid("Invalid card ID"),
});

export type CardIdParam = z.infer<typeof cardIdParamSchema>;
