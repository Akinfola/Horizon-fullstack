import { z } from "zod";

export const createTransferSchema = z.object({
  sourceBankId: z.string().uuid("Invalid source account ID"),
  recipientEmail: z.string().email("Invalid recipient email address"),
  recipientAccountNumber: z.string().min(5, "Account number is too short"),
  amount: z.number().positive("Amount must be greater than zero"),
  note: z.string().max(200, "Note is too long").optional(),
});

export type CreateTransferInput = z.infer<typeof createTransferSchema>;
