import { IsNotEmpty } from 'class-validator';

export class FundWalletDto {
  @IsNotEmpty() amount: number;
}
