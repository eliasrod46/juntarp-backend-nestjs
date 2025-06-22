import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  AssignPermissionsToRolDto,
  CreateRoleDto,
  UpdateRoleDto,
} from '../dto/role.dto';
import { RolesService } from '../services/roles.service';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return await this.rolesService.findAll();
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Patch('assign-permissions/:id')
  assinPermissions(
    @Param('id') id: string,
    @Body() assignPermissionsToRolDto: AssignPermissionsToRolDto,
  ) {
    return this.rolesService.assinPermissions(id, assignPermissionsToRolDto);
  }
}
