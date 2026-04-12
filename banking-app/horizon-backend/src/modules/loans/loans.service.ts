import { eq } from "drizzle-orm";
import { db } from "../../config/db";
import { loans } from "../../config/schema";

export const getLoansService = async (userId: string) => {
  return await db
    .select()
    .from(loans)
    .where(eq(loans.userId, userId));
};

export const applyLoanService = async (
  userId: string,
  input: { amount: number; termMonths: number }
) => {
  const interestRate = 5.0;
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment =
    (input.amount * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -input.termMonths));

  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + input.termMonths);

  const [loan] = await db
    .insert(loans)
    .values({
      userId,
      amount: input.amount.toString(),
      interestRate: interestRate.toString(),
      termMonths: input.termMonths,
      monthlyPayment: monthlyPayment.toFixed(2),
      remainingBalance: input.amount.toString(),
      status: "pending",
      startDate,
      endDate,
    })
    .returning();

  return loan;
};