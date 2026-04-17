import { db } from "../../config/db";
import { auditLogs, auditActionEnum } from "../../config/schema";

export type AuditAction = (typeof auditActionEnum.enumValues)[number];

interface AuditLogInput {
  userId?: string;
  action: AuditAction;
  entityType?: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
}

export const createAuditLog = async (input: AuditLogInput) => {
  try {
    await db.insert(auditLogs).values({
      userId: input.userId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
    });
  } catch (error) {
    // We don't want audit logging to break the main business logic
    // but in a real banking app, you might want strict logging or alerting
    console.error("🔴 Audit Log Error:", error);
  }
};
