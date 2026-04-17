import { eq } from "drizzle-orm";
import { db } from "../../config/db";
import { cards } from "../../config/schema";
import { createAuditLog } from "../audit/audit.service";

export const getCardsService = async (userId: string) => {
  return await db
    .select()
    .from(cards)
    .where(eq(cards.userId, userId));
};

export const freezeCardService = async (id: string, userId: string) => {
  const [card] = await db
    .select()
    .from(cards)
    .where(eq(cards.id, id))
    .limit(1);

  if (!card) throw new Error("Card not found");
  if (card.userId !== userId) throw new Error("Not authorized");

  const [updated] = await db
    .update(cards)
    .set({ status: "frozen" })
    .where(eq(cards.id, id))
    .returning();

  await createAuditLog({
    userId,
    action: "CARD_FROZEN",
    entityType: "card",
    entityId: id,
  });

  return updated;
};

export const unfreezeCardService = async (id: string, userId: string) => {
  const [card] = await db
    .select()
    .from(cards)
    .where(eq(cards.id, id))
    .limit(1);

  if (!card) throw new Error("Card not found");
  if (card.userId !== userId) throw new Error("Not authorized");

  const [updated] = await db
    .update(cards)
    .set({ status: "active" })
    .where(eq(cards.id, id))
    .returning();

  await createAuditLog({
    userId,
    action: "CARD_UNFROZEN",
    entityType: "card",
    entityId: id,
  });

  return updated;
};