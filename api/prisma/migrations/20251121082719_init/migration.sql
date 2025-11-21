-- CreateTable
CREATE TABLE "materials" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "persianNames" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "edge_banding" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "edge_banding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cnc_operations" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cnc_operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fittings" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "qtyPerFitting" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fittings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing_configs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "overhead1" DOUBLE PRECISION NOT NULL DEFAULT 0.25,
    "overhead2" DOUBLE PRECISION NOT NULL DEFAULT 0.04,
    "overhead3" DOUBLE PRECISION NOT NULL DEFAULT 0.02,
    "overhead4" DOUBLE PRECISION NOT NULL DEFAULT 0.02,
    "contingency" DOUBLE PRECISION NOT NULL DEFAULT 0.025,
    "profitMargin" DOUBLE PRECISION NOT NULL DEFAULT 0.22,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "materials_code_key" ON "materials"("code");

-- CreateIndex
CREATE UNIQUE INDEX "edge_banding_code_key" ON "edge_banding"("code");

-- CreateIndex
CREATE UNIQUE INDEX "cnc_operations_code_key" ON "cnc_operations"("code");

-- CreateIndex
CREATE UNIQUE INDEX "fittings_code_key" ON "fittings"("code");

-- CreateIndex
CREATE UNIQUE INDEX "pricing_configs_name_key" ON "pricing_configs"("name");
