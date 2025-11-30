/*
  Warnings:

  - Added the required column `paidAmount` to the `rent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rent" ADD COLUMN     "paidAmount" INTEGER NOT NULL;
