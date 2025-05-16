import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AssignRolesUserDto,
  ChangePasswordDto,
  CreateUserDto,
  UpdateUserDto,
} from './dto/user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, In, Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { RolesService } from '../roles/services/roles.service';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    //check if user was soft deleted
    const deletedUser = await this.findDeletedUser(createUserDto);

    // if was deleted, restore
    if (deletedUser) {
      await this.userRepository.restore(deletedUser.id);
      return deletedUser;
    }

    //check if user was soft deleted
    const usernameUser = await this.findOneByUsername(createUserDto.username);

    if (usernameUser) {
      throw new BadRequestException(
        'Ya existe un usuario con el mismo nombre de usuario',
      );
    }

    //check if user was soft deleted
    const emailUser = await this.findOneByUsername(createUserDto.username);

    if (emailUser) {
      throw new BadRequestException('Ya existe un usuario con el mismo email');
    }

    //check if user was soft deleted
    const dniUser = await this.findOneByDni(createUserDto.dni);

    if (dniUser) {
      throw new BadRequestException('Ya existe un usuario con el mismo dni');
    }

    return this.userRepository.save({
      ...createUserDto,
      password: await bcryptjs.hash(createUserDto.dni, 10),
    });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    try {
      //check if user was soft deleted
      const usernameUser = await this.findOneByUsername(updateUserDto.username);

      if (usernameUser && usernameUser.id != id) {
        throw new BadRequestException(
          'Ya existe un usuario con el mismo nombre de usuario',
        );
      }

      //check if user was soft deleted
      const emailUser = await this.findOneByUsername(updateUserDto.username);

      if (emailUser && emailUser.id != id) {
        throw new BadRequestException(
          'Ya existe un usuario con el mismo email',
        );
      }

      //check if user was soft deleted
      const dniUser = await this.findOneByDni(updateUserDto.dni);

      if (dniUser && dniUser.id != id) {
        throw new BadRequestException('Ya existe un usuario con el mismo dni');
      }

      const result = await this.userRepository.update(id, updateUserDto);

      if (result.affected === 0) {
        throw new NotFoundException(`Docente con ID ${id} no encontrado`);
      }

      return this.findOneByDni(updateUserDto.dni);
    } catch (error) {
      return null;
      // console.log(error);

      // throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Docente con ID ${id} no encontrado`);
    }
  }

  // custom
  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findOneByUsername(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  findOneByDni(dni: string) {
    return this.userRepository.findOneBy({ dni });
  }

  async findDeletedUser(createUserDto: CreateUserDto): Promise<User | null> {
    const whereConditions: any[] = [];

    whereConditions.push({ dni: createUserDto.dni });
    whereConditions.push({ email: createUserDto.email });
    whereConditions.push({ username: createUserDto.username });

    const options: FindOneOptions<User> = {
      where: whereConditions, // TypeORM interpreta un array de 'where' como condiciones OR
      withDeleted: true,
    };

    try {
      const deletedUser = await this.userRepository.findOne(options);
      return deletedUser;
    } catch (error) {
      // console.error(
      //   'Error buscando usuario eliminado por múltiples identificadores:',
      //   error,
      // );
      return null;
    }
  }

  async assignRoles(
    assignRolesUserDto: AssignRolesUserDto,
  ): Promise<true | null> {
    const user = await this.userRepository.findOne({
      where: { id: assignRolesUserDto.user_id },
    });
    if (!user) {
      throw new NotFoundException(
        `Usuario con Id "${assignRolesUserDto.user_id}" no encontrado.`,
      );
    }

    const rolesToAssign = await this.roleRepository.find({
      where: { id: In(assignRolesUserDto.roles_id) },
    });

    user.roles = rolesToAssign;
    try {
      await this.userRepository.save(user);
    } catch (error) {
      console.error('Error al asignar roles al usuario:', error);
      // throw error;
      return null;
    }
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<true | null> {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!user) {
      throw new NotFoundException(`Usuario con Id "${id}" no encontrado.`);
    }

    const isPassowrdValid = await bcryptjs.compare(
      changePasswordDto.oldPassword,
      user.password,
    );

    if (!isPassowrdValid) {
      throw new UnauthorizedException('El password no es valido');
    }

    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new UnauthorizedException('Los passwords no coinciden');
    }

    user.password = await bcryptjs.hash(changePasswordDto.newPassword, 10);
    try {
      await this.userRepository.save(user);
      return true;
    } catch (error) {
      console.error('Error al asignar roles al usuario:', error);
      // throw error;
      return null;
    }
  }

  async resetPassword(
    id: string,
  ): Promise<true | null> {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!user) {
      throw new NotFoundException(`Usuario con Id "${id}" no encontrado.`);
    }


    user.password = await bcryptjs.hash(user.dni, 10);
    try {
      await this.userRepository.save(user);
      return true;
    } catch (error) {
      console.error('Error al resetear password al usuario:', error);
      // throw error;
      return null;
    }
  }



}
