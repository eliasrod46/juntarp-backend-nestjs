import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  AssignRolesUserDto,
  ChangePasswordDto,
} from './dto/user.dto';
import { AuthGuard } from '../auth/guard/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return users;
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Post('assign-roles')
  assignRoles(@Body() assignRolesUserDto: AssignRolesUserDto) {
    return this.userService.assignRoles(assignRolesUserDto);
  }

  @UseGuards(AuthGuard)
  @Patch('change-password/:id')
  changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(id, changePasswordDto);
  }

  // @UseGuards(AuthGuard)
  @Patch('reset-password/:id')
  resetPassword(
    @Param('id') id: string,
  ) {
    return this.userService.resetPassword(id);
  }
}