import { prisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/lib/auth.js';

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: { email: 'admin@demo.com', passwordHash: await hashPassword('Admin1234!'), role: 'ADMIN' },
  });
  console.log('seed done');
}

main().finally(() => prisma.$disconnect());
