import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:1234@localhost:5432/lexacut?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting database seed...\n');

  // Read existing JSON files
  const pricingTablesPath = join(__dirname, '../src/data/pricing-tables.json');
  const fittingsCatalogPath = join(__dirname, '../src/data/fittings-catalog.json');

  const pricingTables = JSON.parse(readFileSync(pricingTablesPath, 'utf-8'));
  const fittingsCatalog = JSON.parse(readFileSync(fittingsCatalogPath, 'utf-8'));

  // Seed Materials
  console.log('Seeding materials...');
  for (const material of pricingTables.materials) {
    await prisma.material.upsert({
      where: { code: material.code },
      update: {},
      create: {
        code: material.code,
        description: material.description,
        unit: material.unit,
        unitPrice: material.unitPrice,
        category: material.category || 'General',
        persianNames: material.persianNames || [],
        isActive: true,
      },
    });
  }
  console.log(`✓ Seeded ${pricingTables.materials.length} materials\n`);

  // Seed Edge Banding
  console.log('Seeding edge banding...');
  for (const edge of pricingTables.edgeBanding) {
    await prisma.edgeBanding.upsert({
      where: { code: edge.code },
      update: {},
      create: {
        code: edge.code,
        description: edge.description,
        unit: edge.unit,
        unitPrice: edge.unitPrice,
        isActive: true,
      },
    });
  }
  console.log(`✓ Seeded ${pricingTables.edgeBanding.length} edge banding types\n`);

  // Seed CNC Operations
  console.log('Seeding CNC operations...');
  for (const cnc of pricingTables.cncOperations) {
    await prisma.cNCOperation.upsert({
      where: { code: cnc.code },
      update: {},
      create: {
        code: cnc.code,
        description: cnc.description,
        unit: cnc.unit,
        unitPrice: cnc.unitPrice,
        isActive: true,
      },
    });
  }
  console.log(`✓ Seeded ${pricingTables.cncOperations.length} CNC operations\n`);

  // Seed Fittings
  console.log('Seeding fittings...');
  for (const fitting of fittingsCatalog.fittings) {
    await prisma.fitting.upsert({
      where: { code: fitting.code },
      update: {},
      create: {
        code: fitting.code,
        name: fitting.name,
        unit: fitting.unit,
        unitPrice: fitting.unitPrice,
        qtyPerFitting: fitting.qtyPerFitting || 1,
        isActive: true,
      },
    });
  }
  console.log(`✓ Seeded ${fittingsCatalog.fittings.length} fittings\n`);

  // Seed Default Pricing Configuration
  console.log('Seeding pricing configuration...');
  await prisma.pricingConfig.upsert({
    where: { name: 'default' },
    update: {},
    create: {
      name: 'default',
      overhead1: 0.25,
      overhead2: 0.04,
      overhead3: 0.02,
      overhead4: 0.02,
      contingency: 0.025,
      profitMargin: 0.22,
      isActive: true,
    },
  });
  console.log('✓ Seeded default pricing configuration\n');

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

