import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty() @IsString() firstname: string;
  @IsNotEmpty() @IsString() lastname: string;
  @IsNotEmpty() @IsString() email: string;
  @IsNotEmpty() @IsString() password: string;
  @IsNotEmpty() @IsString() phone: string;
}

export class LoginUserDto {
  @IsNotEmpty() @IsString() email: string;
  @IsNotEmpty() @IsString() password: string;
}

export class TransactionDto {
  @IsNotEmpty() debitAccountId: string;
  @IsNotEmpty() creditAccountid: string;
  @IsNotEmpty() amount: number;
}
