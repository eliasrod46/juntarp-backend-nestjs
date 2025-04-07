import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginAuthDto, RegisterAuthDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  // async register({ email, name, password }: RegisterAuthDto) {
  //   const user = await this.userService.findOneByEmail(email);

  //   console.log(user);

  //   if (user) {
  //     throw new BadRequestException('User already exists');
  //   }

  //   await this.userService.create({
  //     email,
  //     name,
  //     password: await bcryptjs.hash(password, 10),
  //   });

  //   return { email, name };
  // }

  async login({ email, password }: LoginAuthDto) {
    const userEmail = await this.userService.findOneByEmail(email);
    const userDni = await this.userService.findOneByDni(email);
    const userUsername = await this.userService.findOneByUsername(email);

    let user: User;
    if (userEmail) {
      user = userEmail;
    } else if (userDni) {
      user = userDni;
    } else if (userUsername) {
      user = userUsername;
    } else {
      throw new UnauthorizedException('User not exists');
    }

    const isPassowrdValid = await bcryptjs.compare(password, user.password);

    if (!isPassowrdValid) {
      throw new UnauthorizedException('Password not valid');
    }

    const user_data = {
      dni: user.dni,
      username: user.username,
      fullname: `${user.lastname}, ${user.name}`,
      auth: {
        roles: [user.rol],
        permissions: [],
      },
    };

    const payload = { dni: user.dni };
    const token = await this.jwtService.signAsync(payload);

    return { token, user_data };
  }

  // async profile({ email, role }: { email: string; role: string }) {
  //   if (role !== 'admin') {
  //     throw new UnauthorizedException(
  //       'You are not authoried to access this resource',
  //     );
  //   }

  //   return await this.userService.findOneByEmail(email);
  // }
}
