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

    const userData = {
      id: user.id,
      dni: user.dni,
      username: user.username,
      fullname: `${user.lastname}, ${user.name}`,
      auth: await this.getPermissions(user),
    };
    const payload = { dni: user.dni };
    const token = await this.jwtService.signAsync(payload);

    return { token, userData };
  }

  async getPermissions(user: User) {
    const rolesToSend: string[] = [];
    const user_roles = user.roles;
    user_roles.forEach((role) => {
      rolesToSend.push(role.name);
    });

    return {
      roles: rolesToSend,
      permissions: [],
    };
  }
}
