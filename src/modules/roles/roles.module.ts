import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RolesController } from './controller/roles.controller';
import { RolesService } from './services/roles.service';
import { PermissionsService } from './services/permissions.service';
import { PermissionsController } from './controller/permissions.controller';
import { Permission } from './entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    TypeOrmModule.forFeature([Permission]),
  ],
  controllers: [RolesController, PermissionsController],
  providers: [RolesService, PermissionsService],
  exports: [TypeOrmModule],
})
export class RolesModule {}
