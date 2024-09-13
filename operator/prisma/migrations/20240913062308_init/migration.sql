CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION prefix_uuid(prefix text) RETURNS text AS $$
BEGIN
    RETURN concat(prefix, gen_random_uuid());
END;
$$ LANGUAGE PLPGSQL VOLATILE;

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL DEFAULT prefix_uuid('order-'::text),
    "trader" TEXT NOT NULL,
    "tickToSellAt" TEXT NOT NULL,
    "zeroForOne" BOOLEAN NOT NULL,
    "inputAmount" TEXT,
    "outputAmount" TEXT,
    "tokenInput" TEXT NOT NULL,
    "poolKeyId" TEXT NOT NULL,
    "permit2Signature" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "permit2Deadline" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "permit2Nonce" TEXT NOT NULL,
    "orderSignature" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoolKey" (
    "id" TEXT NOT NULL DEFAULT prefix_uuid('poolKey-'::text),
    "token0" TEXT NOT NULL,
    "token1" TEXT NOT NULL,
    "fee" TEXT NOT NULL,
    "tickSpacing" TEXT NOT NULL,
    "hooks" TEXT NOT NULL,

    CONSTRAINT "PoolKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Order_trader_idx" ON "Order"("trader");

-- CreateIndex
CREATE INDEX "Order_poolKeyId_idx" ON "Order"("poolKeyId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_trader_tickToSellAt_zeroForOne_tokenInput_startTime_p_key" ON "Order"("trader", "tickToSellAt", "zeroForOne", "tokenInput", "startTime", "poolKeyId");

-- CreateIndex
CREATE INDEX "PoolKey_token0_idx" ON "PoolKey"("token0");

-- CreateIndex
CREATE INDEX "PoolKey_token1_idx" ON "PoolKey"("token1");

-- CreateIndex
CREATE UNIQUE INDEX "PoolKey_token0_token1_fee_tickSpacing_hooks_key" ON "PoolKey"("token0", "token1", "fee", "tickSpacing", "hooks");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_poolKeyId_fkey" FOREIGN KEY ("poolKeyId") REFERENCES "PoolKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
