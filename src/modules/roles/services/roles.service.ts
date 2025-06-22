import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import {
  AssignPermissionsToRolDto,
  CreateRoleDto,
  UpdateRoleDto,
} from '../dto/role.dto';
import { Permission } from '../entities/permission.entity';
import { PermissionsService } from './permissions.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      //check if docente was soft deleted
      const deletedRole = await this.findDeletedRoleByName(createRoleDto.name);

      // if was deleted, restore
      if (deletedRole) {
        await this.roleRepository.restore(deletedRole.id);
        return deletedRole;
      }

      // if not, create
      const newRole = this.roleRepository.create(createRoleDto);
      return await this.roleRepository.save(newRole);
    } catch (error) {
      console.log({ error });

      // throw error;
    }
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async findOne(id: string): Promise<Role | null> {
    if (id) {
      const role = await this.roleRepository.findOne({
        where: { id },
        relations: ['permissions'], // Carga la relación 'permissions'
      });

      if (!role) {
        throw new NotFoundException(`Role with ID "${id}" not found`);
      }
      return role;
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role | null> {
    try {
      const check = await this.findRoleByName(updateRoleDto.name);

      if (check) {
        throw new BadRequestException(
          `El rol: ${updateRoleDto.name} ya existe.`,
        );
      }
      const result = await this.roleRepository.update(id, updateRoleDto);
      if (result.affected === 0) {
        throw new NotFoundException(`Rol con ID ${id} no encontrado`);
      }
      return this.findOne(id);
    } catch (error) {
      console.log({ error });

      // throw error;
    }
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.roleRepository.softDelete(id);
  }

  //news

  async findDeletedRoleByName(name: string): Promise<Role | null> {
    const response = await this.roleRepository.findOne({
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

  async findRoleByName(name: string): Promise<Role | null> {
    const response = await this.roleRepository.findOne({
      where: { name },
    });

    return response;
  }

  async assinPermissions(
    id: string,
    assignPermissionsToRolDto: AssignPermissionsToRolDto,
  ): Promise<void> {
    try {
      //get role entity
      const roleToUpdate = await this.findOne(id);

      // get names of permissions recived
      const receivedPermissionNames = assignPermissionsToRolDto.permissions.map(
        (p) => p.name,
      );

      // get entities of permissions
      const fullReceivedPermissions: Permission[] =
        await this.permissionRepository.find({
          where: receivedPermissionNames.map((name) => ({ name })),
        });

      // update and save role
      roleToUpdate.permissions = fullReceivedPermissions;
      await this.roleRepository.save(roleToUpdate);

      // const check = await this.findRoleByName(updateRoleDto.name);
      // if (check) {
      //   throw new BadRequestException(
      //     `El rol: ${updateRoleDto.name} ya existe.`,
      //   );
      // }
      // const result = await this.roleRepository.update(id, updateRoleDto);
      // if (result.affected === 0) {
      //   throw new NotFoundException(`Rol con ID ${id} no encontrado`);
      // }
      // return this.findOne(id);
    } catch (error) {
      console.log({ error });

      // throw error;
    }
  }
}
