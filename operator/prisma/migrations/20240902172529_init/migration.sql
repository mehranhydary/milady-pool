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
    "poolKeyId" TEXT NOT NULL,

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

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_poolKeyId_fkey" FOREIGN KEY ("poolKeyId") REFERENCES "PoolKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
