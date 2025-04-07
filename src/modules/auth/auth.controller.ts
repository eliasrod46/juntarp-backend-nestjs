import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto, RegisterAuthDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { AuthGuard } from './guard/auth.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    email: string;
    role: string;
  };
}
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('register')
  // register(@Body() registerAuthDto: RegisterAuthDto) {
  //   console.log(registerAuthDto);

  //   // return this.authService.register(registerAuthDto);

  // }

  // @Post('register')
  // async register(@Body() registerAuthDto: RegisterAuthDto) {
  //   return await this.authService.register(registerAuthDto);
  // }

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    return await this.authService.login(loginAuthDto);
  }

  // @Get('profile')
  // @UseGuards(AuthGuard)
  // async profile(@Req() req: RequestWithUser) {
  //   const { email, role } = req.user;
  //   return await this.authService.profile({ email, role });
  // }
}
