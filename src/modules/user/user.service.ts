import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
}
