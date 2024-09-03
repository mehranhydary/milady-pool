/*
  Warnings:

  - Added the required column `deadline` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokenInput` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tokenInput" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Order_trader_idx" ON "Order"("trader");

-- CreateIndex
CREATE INDEX "Order_poolKeyId_idx" ON "Order"("poolKeyId");

-- CreateIndex
CREATE INDEX "PoolKey_token0_idx" ON "PoolKey"("token0");

-- CreateIndex
CREATE INDEX "PoolKey_token1_idx" ON "PoolKey"("token1");
