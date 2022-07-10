import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './config/database/prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './config/database/prisma/prisma.module';
import { WalletsModule } from './wallets/wallets.module';

@Module({
  imports: [UsersModule, AuthModule, PrismaModule, WalletsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
