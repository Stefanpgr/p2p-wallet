import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { nanoid } from 'nanoid';
import { PrismaService } from '../config/database/prisma/prisma.service';
import { FundWalletDto, InitWalletFundDto } from './dto/fund-wallet.dto';
import { WalletTransferDto } from './dto/wallet-transfer.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const paystack = require('paystack-api')(process.env.PAYSTACK_SK_KEY);

@Injectable()
export class WalletsService {
  constructor(private readonly prismaService: PrismaService) {}

  async fundWallet({ reference }: FundWalletDto) {
    const response = await paystack.transaction.verify({
      reference,
    });
    const { amount, status } = response.data;

    if (status !== 'success') {
      throw new BadRequestException('Invalid transaction');
    }

    const transaction = await this.prismaService.walleTransaction.findFirst({
      where: { ref: reference },
    });

    if (transaction.status && transaction.status !== 'PENDING') {
      throw new BadRequestException('Invalid transaction');
    }
    // remove the transaction fee that was added earlier
    const amountPaid = amount / 100 - transaction.fee;

    const amountTofund = transaction.amount;

    if (amountTofund > amountPaid) {
      throw new BadRequestException('Invalid amount');
    }

    await this.prismaService.$transaction(async (prisma: PrismaClient) => {
      await prisma.wallet.update({
        where: {
          id: transaction.credit_account_id,
        },
        data: {
          balance: { increment: amountTofund },
        },
      });
      await prisma.walleTransaction.update({
        where: { id: transaction.id },
        data: {
          status: 'SUCCESS',
          prev_balance: transaction.new_balance,
          new_balance: { increment: amountTofund },
        },
      });
    });
    return response.data;
  }

  async initWalletFunding(user: User, { amount }: InitWalletFundDto) {
    const wallet = await this.findOne(user.id);
    const helper = new paystack.FeeHelper({
      percentage: 0.016,
      cap: 2000,
      additionalCharge: amount > 2500 ? 100 : 0,
    });
    const fee = helper.addFeesTo(amount) + (amount > 2500 ? 100 : 0) - amount;
    const totalAmount = (amount + fee) * 100;

    const response = await paystack.transaction.initialize({
      email: 'stefan@gmail.com',
      amount: totalAmount,
    });

    await this.prismaService.walleTransaction.create({
      data: {
        type: 'CREDIT',
        status: 'PENDING',
        amount,
        fee,
        ref: response.data.reference,
        credit_account_id: wallet.id,
      },
    });
    console.log(response);
    return response.data;
  }

  async findAll() {
    const wallets = await this.prismaService.wallet.findMany();
    return wallets;
  }

  async walletTransfer({
    debitAccountId,
    amount,
    creditAccountid,
  }: WalletTransferDto) {
    const creditAccount = await this.prismaService.wallet.findUnique({
      where: { id: creditAccountid },
    });
    const debitAccount = await this.prismaService.wallet.findUnique({
      where: { id: debitAccountId },
    });
    if (!creditAccount || !debitAccount)
      throw new BadRequestException('Invalid accounts');

    if (debitAccount.balance < amount)
      throw new BadRequestException('Insufficient Ballance.');

    await this.prismaService.$transaction(async (prisma: PrismaClient) => {
      await prisma.walleTransaction.create({
        data: {
          credit_account_id: creditAccountid,
          debit_account_id: debitAccountId,
          amount: amount,
          status: 'SUCCESS',
          ref: nanoid(10),
          type: 'DEBIT',
          prev_balance: debitAccount.balance,
          new_balance: debitAccount.balance - amount,
        },
      });

      await prisma.wallet.update({
        where: {
          id: debitAccountId,
        },
        data: {
          balance: debitAccount.balance - amount,
        },
      });
      await prisma.wallet.update({
        where: {
          id: creditAccountid,
        },
        data: {
          balance: creditAccount.balance + amount,
        },
      });
    });
  }

  async findOne(id: string) {
    const wallet = await this.prismaService.wallet.findUnique({
      where: { user_id: id },
    });
    return wallet;
  }
}
