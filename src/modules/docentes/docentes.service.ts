import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Docente } from './entities/docente.entity';
import { CreateDocenteDto, UpdateDocenteDto } from './dto/docente.dto';
import { FolderService } from '../archivo/services/folder.service';

@Injectable()
export class DocentesService {
  constructor(
    @InjectRepository(Docente)
    private readonly docenteRepository: Repository<Docente>,
     @Inject(forwardRef(() => FolderService)) 
    private readonly folderService: FolderService,
  ) {}

  async create(createDocenteDto: CreateDocenteDto): Promise<Docente> {
    try {
      //check if docente was soft deleted
      const deletedDocente = await this.findDeletedDocenteByDni(
        createDocenteDto.dni,
      );

      // if was deleted, restore
      if (deletedDocente) {
        await this.docenteRepository.restore(deletedDocente.id);
        return deletedDocente;
      }

      // if not, create
      const newDocente = this.docenteRepository.create(createDocenteDto);
      return await this.docenteRepository.save(newDocente);
    } catch (error) {
      if (error.errno === 1062) {
        throw new BadRequestException(
          `El docente con dni: ${createDocenteDto.dni} ya existe.`,
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<Docente[]> {
    return await this.docenteRepository.find();
  }

  async findOne(id: string): Promise<Docente | null> {
    if (id) {
      const docente = await this.docenteRepository.findOneBy({ id });
      if (!docente) {
        return null;
        throw new NotFoundException(`Docente con ID ${id} no encontrado`);
      }
      return docente;
    } else {
      // console.log('id es undefined, no se realiza la consulta');
      return null;
      throw new NotFoundException(`Id , recibido con ID ${id} no encontrado`);
    }
  }

  async update(
    id: string,
    updateDocenteDto: UpdateDocenteDto,
  ): Promise<Docente | null> {
    try {
      const result = await this.docenteRepository.update(id, updateDocenteDto);
      if (result.affected === 0) {
        throw new NotFoundException(`Docente con ID ${id} no encontrado`);
      }
      return this.findOne(id);
    } catch (error) {
      if (error.errno === 1062) {
        throw new BadRequestException(
          `El docente con dni: ${updateDocenteDto.dni} ya existe.`,
        );
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.docenteRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Docente con ID ${id} no encontrado`);
    }
  }

  //nuevos

  async findDeletedDocenteByDni(dni: string): Promise<Docente | null> {
    const response = await this.docenteRepository.findOne({
      where: { dni },
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

  async findOneByDni(dni: string): Promise<Docente | null> {
    if (dni) {
      const docente = await this.docenteRepository.findOne({ where: { dni } });
      if (!docente) {
        return null;
        throw new NotFoundException(`Docente con dni ${dni} no encontrado`);
      }
      return docente;
    } else {
      // console.log('id es undefined, no se realiza la consulta');
      return null;
      throw new NotFoundException(
        `dni , recibido con dni ${dni} no encontrado`,
      );
    }
  }

  async findAllOnlyDeleted(): Promise<Docente[]> {
    return this.docenteRepository
      .createQueryBuilder('docente')
      .where('docente.deletedAt IS NOT NULL')
      .getMany();
  }

  async findActive(): Promise<Docente[]> {
    return this.docenteRepository.find({ where: { deletedAt: null } });
  }
}
