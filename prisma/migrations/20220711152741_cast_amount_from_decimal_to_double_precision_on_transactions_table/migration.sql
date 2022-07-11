/*
  Warnings:

  - You are about to alter the column `amount` on the `wallet_transactions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,4)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "wallet_transactions" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;
