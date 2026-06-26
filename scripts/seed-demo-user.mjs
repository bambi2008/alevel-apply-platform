import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();
const hash = bcrypt.hashSync('demo123456', 10);

await db.user.upsert({
  where: { email: 'demo@bridge.test' },
  update: { passwordHash: hash },
  create: {
    id: 'demo-user-001',
    email: 'demo@bridge.test',
    passwordHash: hash,
    consents: { create: { type: 'PRIVACY_PIPL', version: '1.0' } },
  },
});

console.log('Done: demo@bridge.test / demo123456');
await db.$disconnect();
