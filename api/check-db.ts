import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = 'postgresql://postgres:1234@localhost:5432/lexacut?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Checking database...\n');
  
  const cncCount = await prisma.cNCOperation.count();
  console.log(`CNC Operations in DB: ${cncCount}`);
  
  const cnc = await prisma.cNCOperation.findMany();
  cnc.forEach(item => {
    console.log(`  - ${item.code}: ${item.description} (${item.unitPrice})`);
  });
  
  await prisma.$disconnect();
  await pool.end();
}

main();

