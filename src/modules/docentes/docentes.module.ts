import { forwardRef, Module } from '@nestjs/common';
import { DocentesService } from './docentes.service';
import { DocentesController } from './docentes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Docente } from './entities/docente.entity';
import { ArchivoModule } from '../archivo/archivo.module';

@Module({
  imports: [TypeOrmModule.forFeature([Docente]),forwardRef(() => ArchivoModule) ],
  controllers: [DocentesController],
  providers: [DocentesService],
  exports: [DocentesService],
})
export class DocentesModule {}
