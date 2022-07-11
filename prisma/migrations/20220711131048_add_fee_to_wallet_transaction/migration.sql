-- AlterTable
ALTER TABLE "wallet_transactions" ADD COLUMN     "fee" DOUBLE PRECISION,
ALTER COLUMN "prev_balance" DROP NOT NULL,
ALTER COLUMN "new_balance" DROP NOT NULL,
ALTER COLUMN "debit_account_id" DROP NOT NULL,
ALTER COLUMN "credit_account_id" DROP NOT NULL;
