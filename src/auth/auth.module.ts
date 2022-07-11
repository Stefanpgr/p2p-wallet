import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaModule } from 'src/config/database/prisma/prisma.module';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from 'src/config/database/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    PassportModule,
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    PrismaService,
    UsersService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
