import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import { PrismaService } from '../config/database/prisma/prisma.service';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { WalletTransferDto } from './dto/wallet-transfer.dto';

@Injectable()
export class WalletsService {
  constructor(private readonly prismaService: PrismaService) {}
  fundWallet({ amount }: FundWalletDto) {
    return 'This action adds a new wallet';
  }

  async findAll() {
    const wallets = await this.prismaService.wallets.findMany();
    return wallets;
  }

  async walletTransfer({
    debitAccountId,
    amount,
    creditAccountid,
  }: WalletTransferDto) {
    const creditAccount = await this.prismaService.wallets.findUnique({
      where: { id: creditAccountid },
    });
    const debitAccount = await this.prismaService.wallets.findUnique({
      where: { id: debitAccountId },
    });
    if (!creditAccount || !debitAccount)
      throw new BadRequestException('Invalid accounts');

    if (debitAccount.balance < amount)
      throw new BadRequestException('Insufficient Ballance.');

    await this.prismaService.$transaction(async (prisma: PrismaClient) => {
      await prisma.wallet_transactions.create({
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

      await prisma.wallets.update({
        where: {
          id: debitAccountId,
        },
        data: {
          balance: debitAccount.balance - amount,
        },
      });
      await prisma.wallets.update({
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
    const wallet = await this.prismaService.wallets.findUnique({
      where: { id },
    });
    return wallet;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
