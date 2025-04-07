import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TurnosTypesService } from '../services/turnos.types.service';
import {
  CreateTurnoTypesDto,
  UpdateTurnoTypesDto,
} from '../dto/turno-types.dto';

@Controller('turnos/turnos-types')
export class TurnosTypesController {
  constructor(private readonly turnosTypesService: TurnosTypesService) {}

  @ApiBearerAuth()
  @Post()
  create(@Body() createTurnoTypesDto: CreateTurnoTypesDto) {
    return this.turnosTypesService.create(createTurnoTypesDto);
  }

  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.turnosTypesService.findAll();
  }

  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.turnosTypesService.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTurnoTypesDto: UpdateTurnoTypesDto,
  ) {
    return this.turnosTypesService.update(id, updateTurnoTypesDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.turnosTypesService.remove(id);
  }
}
