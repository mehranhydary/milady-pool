/*
  Warnings:

  - Added the required column `permit2Signature` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "permit2Signature" TEXT NOT NULL;
