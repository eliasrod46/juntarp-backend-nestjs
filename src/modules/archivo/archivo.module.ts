import { Module } from '@nestjs/common';
import { FolderService } from './services/folder.service';
import { FolderController } from './controllers/folder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from './entities/folder.entity';
import { DocentesModule } from '../docentes/docentes.module';
import { FolderHistory } from './entities/folderHistory.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Folder, FolderHistory]), DocentesModule, UserModule],
  controllers: [FolderController],
  providers: [FolderService],
})
export class ArchivoModule {}
