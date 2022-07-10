import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../config/database/prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async create(payload: CreateUserDto) {
    let user = await this.prismaService.users.findFirst({
      where: {
        email: payload.email,
      },
    });
    if (user) throw new BadRequestException('User already exists.');
    const saltOrRounds = 10;
    const salt = await bcrypt.genSalt(saltOrRounds);
    const hash = await bcrypt.hash(payload.password, salt);
    user = await this.prismaService.users.create({
      data: { ...payload, password: hash },
    });
    const wallet = await this.prismaService.wallets.create({
      data: {
        name: `${payload.firstname.toUpperCase()} ${payload.lastname.toUpperCase()}`,
        user_id: user.id,
      },
    });
    const data = await this.authService.login(user);
    return { ...data, walletId: wallet.id };
  }

  async login({ email, password }: LoginUserDto) {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedException();
    return this.authService.login(user);
  }
}
