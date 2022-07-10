import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  LoginUserDto,
  TransactionDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.create(createUserDto);

    return { message: 'User registered succesfully', data };
  }

  @HttpCode(200)
  @Post('login')
  // @UseGuards(LocalAuthGuard)
  async loginUser(@Body() payload: LoginUserDto) {
    const data = await this.usersService.login(payload);
    return { message: 'Login success', data };
  }
}
