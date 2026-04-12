import { db } from "../../config/db";
import { users, transactions, accounts, loans } from "../../config/schema";
import { desc } from "drizzle-orm";

export const getAdminStatsService = async () => {
  const allUsers = await db.select().from(users);
  const allTransactions = await db.select().from(transactions);
  const allAccounts = await db.select().from(accounts);
  const allLoans = await db.select().from(loans);

  const totalBalance = allAccounts.reduce(
    (sum, acc) => sum + parseFloat(acc.currentBalance),
    0
  );

  return {
    totalUsers: allUsers.length,
    totalTransactions: allTransactions.length,
    totalAccounts: allAccounts.length,
    totalLoans: allLoans.length,
    totalBalance,
  };
};

export const getAdminUsersService = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset(offset);
};

export const getAdminTransactionsService = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return await db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.date))
    .limit(limit)
    .offset(offset);
};