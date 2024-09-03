/*
  Warnings:

  - A unique constraint covering the columns `[token0,token1,fee,tickSpacing,hooks]` on the table `PoolKey` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PoolKey_token0_token1_fee_tickSpacing_hooks_key" ON "PoolKey"("token0", "token1", "fee", "tickSpacing", "hooks");
