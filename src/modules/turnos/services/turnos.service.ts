import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CicloService } from '../../ciclo/ciclo.service';
import { DocentesService } from '../..//docentes/docentes.service';
import { TurnosTypesService } from '../../turnos/services/turnos.types.service';
import * as dayjs from 'dayjs'; // Importa Day.js
import { Turno } from '../entities/turno.entity';
import { CreateTurnoDto, UpdateTurnoDto } from '../dto/turno.dto';

@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(Turno)
    private readonly turnoRepository: Repository<Turno>,

    private readonly docenteService: DocentesService,

    private readonly turnosTypesService: TurnosTypesService,

    private readonly cicloService: CicloService,
  ) {}

  async create(createTurnoDto: CreateTurnoDto) {

    const ciclo = await this.cicloService.findOne(createTurnoDto.cicloId);

    if (!ciclo) {
      throw new BadRequestException('Ciclo no encontrado');
    }

    const turnoType = await this.turnosTypesService.findOne(
      createTurnoDto.turnoTypeId,
    );
    if (!turnoType) {
      throw new BadRequestException(
        'Tipo de turno no encontrado no encontrado',
      );
    }

    const docente = await this.docenteService.findOne(createTurnoDto.docenteId);

    //conditional save if docente exists or not
    if (docente) {
      return await this.turnoRepository.save({
        docente,
        ciclo,
        turnoType,
        ...createTurnoDto,
      });
    } else {
      return await this.turnoRepository.save({
        ciclo,
        turnoType,
        ...createTurnoDto,
      });
    }
  }

  async findAll() {
    return await this.turnoRepository.find();
  }

  async findOne(id: string) {
    const turno = await this.turnoRepository.findOneBy({ id });
    if (!turno) {
      throw new NotFoundException(`Turno con ID ${id} no encontrado`);
    }
    return turno;
  }

  async update(id: string, updateTurnoDto: UpdateTurnoDto) {
    // Obtener el ID del ciclo que quieres asociar

    // obtengo el turno a actualizar
    const turno = await this.findOne(id);
    if (!turno) {
      throw new BadRequestException('Turno no encontrado');
    }

    const timeToUpdate = dayjs(
      updateTurnoDto.time,
      'YYYY-MM-DDTHH:mm:ss.sssZ',
    ).format('HH:mm');

    const dataToUpdate = {
      date: updateTurnoDto.date,
      time: timeToUpdate,
      inscription_type: updateTurnoDto.inscription_type,
    };

    if (updateTurnoDto.cicloId != turno.ciclo.id) {
      // obtengo el ciclo nuevo
      const ciclo = await this.cicloService.findOne(updateTurnoDto.cicloId);
      if (!ciclo) {
        throw new Error('Ciclo no encontrado');
      }
      dataToUpdate['ciclo'] = ciclo;
    }

    return await this.turnoRepository.update(id, dataToUpdate);
  }

  async remove(id: string) {
    const result = await this.turnoRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Turno con ID ${id} no encontrado`);
    }
  }
}
