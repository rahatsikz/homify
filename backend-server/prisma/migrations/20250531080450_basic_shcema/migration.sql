-- CreateTable
CREATE TABLE "magic_code" (
    "phone" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "owner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "houseName" TEXT NOT NULL,
    "houseAddressId" TEXT NOT NULL,
    "bilCopyId" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "electricityMeter" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "electricityMeter" TEXT NOT NULL,
    "gasMeter" TEXT,
    "floor" TEXT NOT NULL,
    "stayStartDate" TIMESTAMP(3) NOT NULL,
    "isSublet" BOOLEAN NOT NULL,
    "numberOfPeople" INTEGER NOT NULL,
    "nid" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sublet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "numberOfPeople" INTEGER NOT NULL,
    "nid" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "sublet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rent" (
    "id" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "paymentStatus" BOOLEAN NOT NULL,
    "paymentDate" TIMESTAMP(3),
    "houseRent" INTEGER NOT NULL,
    "waterBill" INTEGER NOT NULL,
    "electricityBill" INTEGER,
    "gasBill" INTEGER NOT NULL,
    "utilityBill" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "rent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" TEXT NOT NULL,
    "houseNo" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "town" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image_asset" (
    "id" TEXT NOT NULL,
    "assetId" TEXT,
    "publicId" TEXT,
    "secureUrl" TEXT NOT NULL,
    "format" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "resourceType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "image_asset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "magic_code_phone_key" ON "magic_code"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "owner_mobile_key" ON "owner"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "owner_houseAddressId_key" ON "owner"("houseAddressId");

-- CreateIndex
CREATE UNIQUE INDEX "owner_bilCopyId_key" ON "owner"("bilCopyId");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_mobile_key" ON "tenant"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "sublet_mobile_key" ON "sublet"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "sublet_tenantId_key" ON "sublet"("tenantId");

-- AddForeignKey
ALTER TABLE "owner" ADD CONSTRAINT "owner_houseAddressId_fkey" FOREIGN KEY ("houseAddressId") REFERENCES "address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "owner" ADD CONSTRAINT "owner_bilCopyId_fkey" FOREIGN KEY ("bilCopyId") REFERENCES "image_asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sublet" ADD CONSTRAINT "sublet_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rent" ADD CONSTRAINT "rent_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
