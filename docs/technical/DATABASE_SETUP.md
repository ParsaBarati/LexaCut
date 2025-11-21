# Database Setup Guide

## Quick Start with Docker

### 1. Start PostgreSQL Database

```bash
# From project root
docker-compose up -d
```

This will start a PostgreSQL database on `localhost:5432` with:
- **User:** lexacut
- **Password:** lexacut_dev_password
- **Database:** lexacut_pricing

### 2. Set Environment Variable

Create `api/.env` file:

```env
DATABASE_URL="postgresql://lexacut:lexacut_dev_password@localhost:5432/lexacut_pricing?schema=public"
```

### 3. Run Migrations and Seed Data

```bash
cd api

# Generate Prisma Client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# Seed with existing pricing data
npm run prisma:seed
```

### 4. Start the API

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

## Database Commands

```bash
# View database with Prisma Studio
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name migration_name
```

## Stop Database

```bash
docker-compose down

# To also remove data
docker-compose down -v
```

## Manual PostgreSQL Setup (Without Docker)

If you prefer to install PostgreSQL manually:

1. Install PostgreSQL 14+
2. Create database:
   ```sql
   CREATE DATABASE lexacut_pricing;
   CREATE USER lexacut WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE lexacut_pricing TO lexacut;
   ```
3. Update `api/.env` with your connection string
4. Run migrations as described above

