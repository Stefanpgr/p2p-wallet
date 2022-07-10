import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/config/database/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.users.findUnique({ where: { email } });
    if (!user) return null;
    const isMatch = await bcrypt.compare(pass, user?.password);
    console.log(isMatch);
    if (!isMatch) return null;
    const { password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email };
    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
