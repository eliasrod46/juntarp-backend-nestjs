import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import {
  CreateGenericPermissionsDto,
  CreatePermissionDto,
  UpdatePermissionDto,
} from '../dto/permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    try {

      //check if docente was soft deleted
      const deletedPermission = await this.findDeletedPermisssionByName(
        createPermissionDto.name,
      );

      // if was deleted, restore
      if (deletedPermission) {
        await this.permissionRepository.restore(deletedPermission.id);
        return deletedPermission;
      }

      // if not, create
      const newPermission =
        this.permissionRepository.create(createPermissionDto);
      return await this.permissionRepository.save(newPermission);
    } catch (error) {
      console.log({ error });

      // throw error;
    }
  }

  async findAll(): Promise<Permission[]> {
    return await this.permissionRepository.find();
  }

  async findOne(id: string): Promise<Permission | null> {
    if (id) {
      const permission = await this.permissionRepository.findOneBy({ id });
      if (!permission) {
        throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
      }
      return permission;
    } else {
      throw new NotFoundException(`id no recibido`);
    }
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission | null> {
    try {
      const check = await this.findPermisssionByName(updatePermissionDto.name);

      if (check) {
        throw new BadRequestException(
          `El permiso: ${updatePermissionDto.name} ya existe.`,
        );
      }
      const result = await this.permissionRepository.update(
        id,
        updatePermissionDto,
      );
      if (result.affected === 0) {
        throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
      }
      return this.findOne(id);
    } catch (error) {
      console.log({ error });

      // throw error;
    }
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.permissionRepository.softDelete(id);
  }

  //nuevos

  async findDeletedPermisssionByName(name: string): Promise<Permission | null> {
    const response = await this.permissionRepository.findOne({
      where: { name },
      withDeleted: true,
    });

    if (response != null) {
      if (response.deletedAt != null) {
        return response;
      } else {
        return null;
      }
    } else {
      return response;
    }
  }

  async findPermisssionByName(name: string): Promise<Permission | null> {
    const response = await this.permissionRepository.findOne({
      where: { name },
    });

    return response;
  }

  async genericPermissions(
    createGenericPermissionsDto: CreateGenericPermissionsDto,
  ): Promise<void> {
    try {
      createGenericPermissionsDto.permissions.forEach(
        async (createPermissionDto) => {
          const deletedPermission = await this.findDeletedPermisssionByName(
            createPermissionDto.name,
          );

          // if was deleted, restore
          if (deletedPermission) {
            await this.permissionRepository.restore(deletedPermission.id);
          }

          // if not, create
          const newPermission = this.permissionRepository.create(createPermissionDto);
          await this.permissionRepository.save(newPermission);

        },
      );
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }
}
