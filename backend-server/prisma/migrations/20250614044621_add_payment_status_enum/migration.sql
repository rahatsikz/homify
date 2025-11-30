/*
  Warnings:

  - The `paymentStatus` column on the `rent` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'DUE', 'PARTIAL');

-- AlterTable
ALTER TABLE "rent" ADD COLUMN     "dueAmount" INTEGER,
DROP COLUMN "paymentStatus",
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'DUE';
