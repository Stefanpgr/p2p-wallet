import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { FundWalletDto, InitWalletFundDto } from './dto/fund-wallet.dto';
import { WalletTransferDto } from './dto/wallet-transfer.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @HttpCode(200)
  @Post('fund')
  async fundWallet(
    @GetUser() user: User,
    @Body() createWalletDto: FundWalletDto,
  ) {
    await this.walletsService.fundWallet(createWalletDto);
    return { message: 'Wallet funded successfully.' };
  }

  @HttpCode(200)
  @Post('fund/initialize')
  async initWalletFunding(
    @GetUser() user: User,
    @Body() initWalletFundDto: InitWalletFundDto,
  ) {
    const data = await this.walletsService.initWalletFunding(
      user,
      initWalletFundDto,
    );
    return { message: 'Click on the link to complete transaction.', data };
  }

  @HttpCode(200)
  @Get()
  async findAll() {
    const wallets = await this.walletsService.findAll();

    return { message: 'User wallets', data: wallets };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const wallet = await this.walletsService.findOne(id);
    return { message: 'Wallet data fetch successful', data: wallet };
  }

  @HttpCode(200)
  @Post('transfer')
  async walletTransfer(
    @GetUser() user: User,
    @Body() walletTransferDto: WalletTransferDto,
  ) {
    await this.walletsService.walletTransfer(walletTransferDto);
    return { message: 'Transfer successful' };
  }
}
