import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FolderService } from '../services/folder.service';
import { CreateFolderDto, UpdateFolderDto } from '../dto';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { Request } from 'express';

@Controller('archivo/folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createArchivoDto: CreateFolderDto) {
    return this.folderService.create(createArchivoDto);
  }

  @UseGuards(AuthGuard)
  @Get('ingreso-folders')
  findAllOriginIngreso() {
    return this.folderService.findAll(1);
  }

  @UseGuards(AuthGuard)
  @Get('history-ingreso-folders')
  findAllHistoryOriginIngreso() {
    return this.folderService.findAllHistory(1);
  }

  @UseGuards(AuthGuard)
  @Get('titulares-folders')
  findAllOriginTitulares() {
    return this.folderService.findAll(2);
  }

  @UseGuards(AuthGuard)
  @Get('create-folders')
  createFolders() {
    return this.folderService.createFolders();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.folderService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateArchivoDto: UpdateFolderDto,
    @Req() request: any,
  ) {
    return this.folderService.update(id, updateArchivoDto, request.user);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.folderService.remove(id);
  }
}
