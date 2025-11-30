-- CreateTable
CREATE TABLE "DescoReading" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "readingTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DescoReading_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DescoReading_tenantId_key" ON "DescoReading"("tenantId");

-- CreateIndex
CREATE INDEX "DescoReading_tenantId_idx" ON "DescoReading"("tenantId");

-- AddForeignKey
ALTER TABLE "DescoReading" ADD CONSTRAINT "DescoReading_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
