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
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { PermissionsService } from '../services/permissions.service';
import {
  CreateGenericPermissionsDto,
  CreatePermissionDto,
  UpdatePermissionDto,
} from '../dto/permission.dto';

@Controller('permisos')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return await this.permissionsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Post('generic-permissions')
  genericPermissions(@Body() createGenericPermissionsDto: CreateGenericPermissionsDto) {
    return this.permissionsService.genericPermissions(createGenericPermissionsDto);
  }
}
