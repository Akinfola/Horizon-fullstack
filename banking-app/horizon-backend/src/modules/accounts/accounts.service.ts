import { eq, sum } from "drizzle-orm";
import { db } from "../../config/db";
import { accounts } from "../../config/schema";
import { CreateAccountInput } from "./accounts.types";

export const getAccountsService = async (userId: string) => {
  return await db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, userId));
};

export const getAccountByIdService = async (id: string, userId: string) => {
  const [account] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.id, id))
    .limit(1);

  if (!account) throw new Error("Account not found");
  if (account.userId !== userId) throw new Error("Not authorized");

  return account;
};

export const getTotalBalanceService = async (userId: string) => {
  const userAccounts = await db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, userId));

  const total = userAccounts.reduce(
    (sum, acc) => sum + parseFloat(acc.currentBalance),
    0
  );

  return {
    totalBalance: total,
    accountCount: userAccounts.length,
    accounts: userAccounts,
  };
};

export const createAccountService = async (
  userId: string,
  input: CreateAccountInput
) => {
  const mask = input.accountNumber.slice(-4);
  const shareableId = crypto.randomUUID();

  const [account] = await db
    .insert(accounts)
    .values({
      userId,
      bankName: input.bankName,
      accountNumber: input.accountNumber,
      accountType: input.accountType,
      cardHolder: input.cardHolder,
      expiryDate: input.expiryDate,
      cardVariant: input.cardVariant,
      currentBalance: input.currentBalance.toString(),
      availableBalance: input.availableBalance.toString(),
      spendingLimit: input.spendingLimit.toString(),
      mask,
      shareableId,
    })
    .returning();

  return account;
};