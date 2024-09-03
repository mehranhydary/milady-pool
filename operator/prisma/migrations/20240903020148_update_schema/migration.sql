/*
  Warnings:

  - A unique constraint covering the columns `[trader,tickToSellAt,zeroForOne,tokenInput,startTime,poolKeyId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Order_trader_tickToSellAt_zeroForOne_tokenInput_poolKeyId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Order_trader_tickToSellAt_zeroForOne_tokenInput_startTime_p_key" ON "Order"("trader", "tickToSellAt", "zeroForOne", "tokenInput", "startTime", "poolKeyId");
