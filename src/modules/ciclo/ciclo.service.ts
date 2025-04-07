import { Injectable } from '@nestjs/common';
import { CreateCicloDto } from './dto/create-ciclo.dto';
import { UpdateCicloDto } from './dto/update-ciclo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ciclo } from './entities/ciclo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CicloService {
  constructor(
    @InjectRepository(Ciclo)
    private readonly cicloRepository: Repository<Ciclo>,
  ) {}

  async create(createCicloDto: CreateCicloDto) {
    return await this.cicloRepository.save(createCicloDto);
  }

  async findAll() {
    // console.log(await this.cicloRepository.find());

    return await this.cicloRepository.find({
      order: {
        year: 'DESC', // Orden ascendente por nombre
      },
    });
  }

  async findOne(id: string) {
    return await this.cicloRepository.findOneBy({ id });
  }

  async getCurrentCiclo() {
    return await this.cicloRepository.findOneBy({ status: true });
  }

  async update(id: string, updateCicloDto: UpdateCicloDto) {
    if (updateCicloDto.status) {
      const oldActiveStatus = await this.cicloRepository.findOneBy({
        status: true,
      });
      if (oldActiveStatus) {
        oldActiveStatus.status = false;
        await this.cicloRepository.update(oldActiveStatus.id, oldActiveStatus);
      }
    }
    return await this.cicloRepository.update(id, updateCicloDto);
  }

  async remove(id: string) {
    return await this.cicloRepository.softDelete({ id });
  }
}
