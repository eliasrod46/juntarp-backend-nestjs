import { Module } from '@nestjs/common';
import { CicloService } from './ciclo.service';
import { CicloController } from './ciclo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ciclo } from './entities/ciclo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ciclo])],
  controllers: [CicloController],
  providers: [CicloService],
  exports: [CicloService],
})
export class CicloModule {}
