import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { PrismaModule } from 'src/config/database/prisma/prisma.module';

@Module({
  controllers: [WalletsController],
  providers: [WalletsService],
  imports: [PrismaModule],
})
export class WalletsModule {}
