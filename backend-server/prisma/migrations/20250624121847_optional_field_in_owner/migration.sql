-- DropForeignKey
ALTER TABLE "owner" DROP CONSTRAINT "owner_bilCopyId_fkey";

-- DropForeignKey
ALTER TABLE "owner" DROP CONSTRAINT "owner_houseAddressId_fkey";

-- AlterTable
ALTER TABLE "owner" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "houseName" DROP NOT NULL,
ALTER COLUMN "houseAddressId" DROP NOT NULL,
ALTER COLUMN "bilCopyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "owner" ADD CONSTRAINT "owner_houseAddressId_fkey" FOREIGN KEY ("houseAddressId") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "owner" ADD CONSTRAINT "owner_bilCopyId_fkey" FOREIGN KEY ("bilCopyId") REFERENCES "image_asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
