import { eq } from "drizzle-orm";
import { db } from "../../config/db";
import { budgets } from "../../config/schema";

export const getBudgetsService = async (userId: string) => {
  return await db
    .select()
    .from(budgets)
    .where(eq(budgets.userId, userId));
};

export const createBudgetService = async (
  userId: string,
  input: {
    category: string;
    limit: number;
    icon: string;
    color: string;
  }
) => {
  const [budget] = await db
    .insert(budgets)
    .values({
      userId,
      category: input.category as any,
      limit: input.limit.toString(),
      spent: "0",
      icon: input.icon,
      color: input.color,
    })
    .returning();

  return budget;
};

export const deleteBudgetService = async (id: string, userId: string) => {
  const [budget] = await db
    .select()
    .from(budgets)
    .where(eq(budgets.id, id))
    .limit(1);

  if (!budget) throw new Error("Budget not found");
  if (budget.userId !== userId) throw new Error("Not authorized");

  await db.delete(budgets).where(eq(budgets.id, id));
  return { message: "Budget deleted" };
};