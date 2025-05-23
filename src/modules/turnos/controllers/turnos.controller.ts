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
import { TurnosService } from '../services/turnos.service';
import { CreateTurnoDto, UpdateTurnoDto } from '../dto/turno.dto';

@Controller('turnos')
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) {}

  @Post()
  create(@Body() createTurnoDto: CreateTurnoDto) {
    return this.turnosService.create(createTurnoDto);
  }

  @Get()
  findAll() {
    return this.turnosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.turnosService.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTurnoDto: UpdateTurnoDto) {
    return this.turnosService.update(id, updateTurnoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.turnosService.remove(id);
  }
}
