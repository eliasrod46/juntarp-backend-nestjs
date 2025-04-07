import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CicloService } from './ciclo.service';
import { CreateCicloDto } from './dto/create-ciclo.dto';
import { UpdateCicloDto } from './dto/update-ciclo.dto';

@Controller('ciclo')
export class CicloController {
  constructor(private readonly cicloService: CicloService) {}

  @Post()
  create(@Body() createCicloDto: CreateCicloDto) {
    console.log(createCicloDto);

    return this.cicloService.create(createCicloDto);
  }

  @Get()
  findAll() {
    
    return this.cicloService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cicloService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCicloDto: UpdateCicloDto) {
    return this.cicloService.update(id, updateCicloDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cicloService.remove(id);
  }
}
