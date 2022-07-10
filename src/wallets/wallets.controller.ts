import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { WalletTransferDto } from './dto/wallet-transfer.dto';

@Controller('wallet')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  async fundWallet(@Body() createWalletDto: WalletTransferDto) {
    const data = await this.walletsService.fundWallet(createWalletDto);
    return { message: 'Click on the link to complete transaction', data };
  }

  @Get()
  async findAll() {
    const wallets = await this.walletsService.findAll();
    return { message: 'User registered succesfully', wallets };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const wallet = await this.walletsService.findOne(id);
    return { message: 'Wallet data fetch successful', wallet };
  }

  @Post('transfer')
  async walletTransfer(@Body() walletTransferDto: WalletTransferDto) {
    await this.walletsService.walletTransfer(walletTransferDto);
    return { message: 'Transfer succesful' };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletsService.remove(+id);
  }
}
