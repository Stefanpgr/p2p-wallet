import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import {
  CreateUserDto,
  LoginUserDto,
  TransactionDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async create(payload: CreateUserDto) {
    let user = await this.prismaService.users.findFirst({
      where: {
        email: payload.email,
      },
    });
    if (user) throw new BadRequestException('User already exists.');
    const saltOrRounds = 10;
    const salt = await bcrypt.genSalt(saltOrRounds);
    const hash = await bcrypt.hash(payload.password, salt);
    user = await this.prismaService.users.create({
      data: { ...payload, password: hash },
    });
    const wallet = await this.prismaService.wallets.create({
      data: {
        name: `${payload.firstname.toUpperCase()} ${payload.lastname.toUpperCase()}`,
        reference_id: nanoid(),
        balance: 50000,
        user_id: user.id,
      },
    });
    const data = await this.authService.login(user);
    return { ...data, walletId: wallet.account_id };
  }

  async login({ email, password }: LoginUserDto) {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedException();
    return this.authService.login(user);
  }

  async updateTransaction({
    debitAccountId,
    amount,
    creditAccountid,
  }: TransactionDto) {
    const creditAccount = await this.prismaService.wallets.findUnique({
      where: { account_id: creditAccountid },
    });
    const debitAccount = await this.prismaService.wallets.findUnique({
      where: { account_id: debitAccountId },
    });
    if (!creditAccount || !debitAccount)
      throw new BadRequestException('Invalid accounts');

    if (Number(debitAccount.balance) < amount)
      throw new BadRequestException('Insufficient Ballance.');
    await this.prismaService.$transaction(async (prisma: PrismaClient) => {
      await prisma.wallet_transactions.create({
        data: {
          credit_account_id: creditAccountid,
          debit_account_id: debitAccountId,
          amount: amount,
          status: 'COMMIT',
          transaction_ref: nanoid(10),
        },
      });

      await prisma.wallets.update({
        where: {
          account_id: debitAccountId,
        },
        data: {
          balance: Number(debitAccount.balance) - amount,
        },
      });
      await prisma.wallets.update({
        where: {
          account_id: creditAccountid,
        },
        data: {
          balance: Number(creditAccount.balance) + amount,
        },
      });
    });
  }
}
