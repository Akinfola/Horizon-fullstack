import { eq, desc, and } from "drizzle-orm";
import { db } from "../../config/db";
import { transactions } from "../../config/schema";

export const getTransactionsService = async (
  accountId: string,
  page = 1,
  limit = 10
) => {
  const offset = (page - 1) * limit;

  const data = await db
    .select()
    .from(transactions)
    .where(eq(transactions.accountId, accountId))
    .orderBy(desc(transactions.date))
    .limit(limit)
    .offset(offset);

  return data;
};

export const getRecentTransactionsService = async (
  userId: string,
  limit = 5
) => {
  const data = await db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.date))
    .limit(limit);

  return data;
};

export const createTransactionService = async (input: {
  name: string;
  amount: number;
  type: "debit" | "credit";
  status: "success" | "processing" | "declined";
  category: string;
  accountId: string;
  senderBankId?: string;
  receiverBankId?: string;
  image?: string;
}) => {
  const [transaction] = await db
    .insert(transactions)
    .values({
      name: input.name,
      amount: input.amount.toString(),
      type: input.type,
      status: input.status,
      category: input.category as any,
      accountId: input.accountId,
      senderBankId: input.senderBankId,
      receiverBankId: input.receiverBankId,
      image: input.image,
    })
    .returning();

  return transaction;
};