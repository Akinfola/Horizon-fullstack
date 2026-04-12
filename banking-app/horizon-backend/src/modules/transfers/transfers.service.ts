import { eq } from "drizzle-orm";
import { db } from "../../config/db";
import { accounts, transactions, users } from "../../config/schema";

export const createTransferService = async (input: {
  sourceBankId: string;
  recipientEmail: string;
  recipientAccountNumber: string;
  amount: number;
  note?: string;
  userId: string;
}) => {
  const [sourceAccount] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.id, input.sourceBankId))
    .limit(1);

  if (!sourceAccount) throw new Error("Source account not found");
  if (sourceAccount.userId !== input.userId) throw new Error("Not authorized");
  if (parseFloat(sourceAccount.currentBalance) < input.amount) {
    throw new Error("Insufficient funds");
  }

  const [recipient] = await db
    .select()
    .from(users)
    .where(eq(users.email, input.recipientEmail))
    .limit(1);

  if (!recipient) throw new Error("Recipient not found");

  const [recipientAccount] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.accountNumber, input.recipientAccountNumber))
    .limit(1);

  if (!recipientAccount) throw new Error("Recipient account not found");

  await db
    .update(accounts)
    .set({
      currentBalance: (
        parseFloat(sourceAccount.currentBalance) - input.amount
      ).toString(),
    })
    .where(eq(accounts.id, sourceAccount.id));

  await db
    .update(accounts)
    .set({
      currentBalance: (
        parseFloat(recipientAccount.currentBalance) + input.amount
      ).toString(),
    })
    .where(eq(accounts.id, recipientAccount.id));

  await db.insert(transactions).values({
    name: `Transfer to ${recipient.firstName} ${recipient.lastName}`,
    amount: input.amount.toString(),
    type: "debit",
    status: "success",
    category: "transfer",
    accountId: sourceAccount.id,
    senderBankId: sourceAccount.id,
    receiverBankId: recipientAccount.id,
  });

  await db.insert(transactions).values({
    name: `Transfer from ${input.userId}`,
    amount: input.amount.toString(),
    type: "credit",
    status: "success",
    category: "transfer",
    accountId: recipientAccount.id,
    senderBankId: sourceAccount.id,
    receiverBankId: recipientAccount.id,
  });

  return { message: "Transfer successful", amount: input.amount };
};