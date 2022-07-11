import { IsNotEmpty } from 'class-validator';

export class FundWalletDto {
  @IsNotEmpty() reference: string;
}

export class InitWalletFundDto {
  @IsNotEmpty() amount: number;
}
