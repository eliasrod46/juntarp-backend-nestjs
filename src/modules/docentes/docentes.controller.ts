import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DocentesService } from './docentes.service';
import { CreateDocenteDto, UpdateDocenteDto } from './dto/docente.dto';

@Controller('docentes')
export class DocentesController {
  constructor(private readonly docentesService: DocentesService) {}

  @Post()
  create(@Body() createDocenteDto: CreateDocenteDto) {
    return this.docentesService.create(createDocenteDto);
  }

  @Get()
  async findAll() {
    const docentes = await this.docentesService.findAll();
    return docentes.map((docente) => ({
      ...docente,
      fullName: docente.fullName,
    }));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.docentesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocenteDto: UpdateDocenteDto) {
    return this.docentesService.update(id, updateDocenteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.docentesService.remove(id);
  }


}
