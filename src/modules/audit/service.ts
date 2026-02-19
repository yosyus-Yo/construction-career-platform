import { prisma } from '../../lib/prisma.js';

export async function writeAudit(actorId: string | null, action: string, targetType: string, targetId: string, meta: object = {}) {
  await prisma.auditLog.create({
    data: { actorId, action, targetType, targetId, metaJson: JSON.stringify(meta) },
  });
}
