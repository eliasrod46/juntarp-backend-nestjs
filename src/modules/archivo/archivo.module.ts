import { forwardRef, Module } from '@nestjs/common';
import { FolderService } from './services/folder.service';
import { FolderController } from './controllers/folder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from './entities/folder.entity';
import { DocentesModule } from '../docentes/docentes.module';
import { FolderHistory } from './entities/folderHistory.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Folder, FolderHistory]),
    forwardRef(() => DocentesModule),
    UserModule,
  ],
  controllers: [FolderController],
  providers: [FolderService],
  exports: [FolderService],
})
export class ArchivoModule {}
