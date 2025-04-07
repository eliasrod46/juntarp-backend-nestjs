import { Module } from '@nestjs/common';
import { TurnosController } from './controllers/turnos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Turno } from './entities/turno.entity';
import { CicloModule } from '../ciclo/ciclo.module';
import { DocentesModule } from '../docentes/docentes.module';
import { TurnoType } from './entities/turnoType.entity';
import { TurnosService } from './services/turnos.service';
import { TurnosTypesService } from './services/turnos.types.service';
import { TurnosTypesController } from './controllers/turnos.types.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Turno]),
    TypeOrmModule.forFeature([TurnoType]),
    CicloModule,
    DocentesModule,
  ],
  controllers: [TurnosTypesController, TurnosController],
  providers: [TurnosService, TurnosTypesService],
  exports: [TypeOrmModule],
})
export class TurnosModule {}
