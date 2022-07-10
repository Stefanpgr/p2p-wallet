/*
  Warnings:

  - You are about to drop the column `transaction_ref` on the `wallet_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_type` on the `wallet_transactions` table. All the data in the column will be lost.
  - Added the required column `ref` to the `wallet_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "wallet_transactions_transaction_ref_status_debit_account_id_key";

-- AlterTable
ALTER TABLE "wallet_transactions" DROP COLUMN "transaction_ref",
DROP COLUMN "transaction_type",
ADD COLUMN     "ref" VARCHAR(100) NOT NULL,
ADD COLUMN     "type" "WalletTransactionType";

-- CreateIndex
CREATE INDEX "wallet_transactions_ref_status_debit_account_id_credit_acco_idx" ON "wallet_transactions"("ref", "status", "debit_account_id", "credit_account_id");
