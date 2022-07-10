import { IsNotEmpty } from 'class-validator';

export class WalletTransferDto {
  @IsNotEmpty() debitAccountId: string;
  @IsNotEmpty() creditAccountid: string;
  @IsNotEmpty() amount: number;
}
