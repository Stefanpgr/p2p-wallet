-- CreateEnum
CREATE TYPE "WalletTransactionStatus" AS ENUM ('COMMIT', 'ROLLBACK');

-- CreateTable
CREATE TABLE "wallet_transactions" (
    "id" SERIAL NOT NULL,
    "transaction_ref" VARCHAR(100) NOT NULL,
    "narration" VARCHAR(250),
    "amount" DECIMAL(15,4) NOT NULL,
    "transaction_type" VARCHAR(10),
    "debit_account_id" INTEGER NOT NULL,
    "credit_account_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "WalletTransactionStatus" NOT NULL,

    CONSTRAINT "wallet_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "account_id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(150),
    "reference_id" VARCHAR(50) NOT NULL,
    "balance" DECIMAL(15,4) NOT NULL DEFAULT 0.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("account_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wallet_transactions_transaction_ref_status_debit_account_id_key" ON "wallet_transactions"("transaction_ref", "status", "debit_account_id", "credit_account_id");

-- CreateIndex
CREATE INDEX "wallets_account_id_reference_id_idx" ON "wallets"("account_id", "reference_id");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_reference_id_key" ON "wallets"("reference_id");

-- AddForeignKey
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_credit_account_id_fkey" FOREIGN KEY ("credit_account_id") REFERENCES "wallets"("account_id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_debit_account_id_fkey" FOREIGN KEY ("debit_account_id") REFERENCES "wallets"("account_id") ON DELETE SET NULL ON UPDATE SET NULL;
