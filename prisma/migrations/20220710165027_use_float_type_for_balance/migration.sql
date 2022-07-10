/*
  Warnings:

  - You are about to alter the column `prev_balance` on the `wallet_transactions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,4)` to `DoublePrecision`.
  - You are about to alter the column `new_balance` on the `wallet_transactions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,4)` to `DoublePrecision`.
  - You are about to alter the column `balance` on the `wallets` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,4)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "wallet_transactions" ALTER COLUMN "prev_balance" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "new_balance" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "wallets" ALTER COLUMN "balance" SET DATA TYPE DOUBLE PRECISION;
