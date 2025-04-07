import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TurnoType } from '../entities/turnoType.entity';
import {
  CreateTurnoTypesDto,
  UpdateTurnoTypesDto,
} from '../dto/turno-types.dto';
import { CicloService } from '../../ciclo/ciclo.service';

@Injectable()
export class TurnosTypesService {
  constructor(
    @InjectRepository(TurnoType)
    private readonly turnoTypeRepository: Repository<TurnoType>,
    private readonly cicloService: CicloService,
  ) {}

  async create(createTurnoTypesDto: CreateTurnoTypesDto) {
    const ciclo = await this.cicloService.getCurrentCiclo();

    if (!ciclo) throw new BadRequestException('No hay un ciclo activo');

    const tipoTurnoCheck = await this.turnoTypeRepository.findOne({
      where: {
        name: createTurnoTypesDto.name,
        ciclo: {
          id: ciclo.id,
        },
      },
      relations: ['ciclo'], // Carga la relación "ciclo" si la necesitas en el resultado
    });

    if (!tipoTurnoCheck) {
      return await this.turnoTypeRepository.save({
        ciclo,
        ...createTurnoTypesDto,
      });
    }
  }

  async findAll() {
    return await this.turnoTypeRepository.find();
  }

  async findOne(id: string) {
    const turno = await this.turnoTypeRepository.findOneBy({ id });
    if (!turno) {
      throw new NotFoundException(`Tipo de turno con ID ${id} no encontrado`);
    }
    return turno;
  }

  async update(id: string, updateTurnoTypesDto: UpdateTurnoTypesDto) {
    // Obtener el ID del ciclo que quieres asociar

    // obtengo el turno a actualizar
    const turnoType = await this.findOne(id);
    if (!turnoType) {
      throw new BadRequestException('Tipo de turno no encontrado');
    }

    return await this.turnoTypeRepository.update(id, updateTurnoTypesDto);
  }

  async remove(id: string) {
    const result = await this.turnoTypeRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Turno con ID ${id} no encontrado`);
    }
  }
}
