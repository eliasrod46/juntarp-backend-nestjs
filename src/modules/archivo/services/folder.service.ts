import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFolderDto, UpdateFolderDto } from '../dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Folder } from '../entities/folder.entity';
import { Repository } from 'typeorm';
import { DocentesService } from '../../docentes/docentes.service';
import { FolderHistory } from '../entities/folderHistory.entity';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
    @InjectRepository(FolderHistory)
    private readonly folderHistoryRepository: Repository<FolderHistory>, //cuando descomento esta linea me da este error
    private readonly docenteService: DocentesService,
    private readonly usersService: UserService,
  ) {}

  async create(createFolderDto: CreateFolderDto) {
    const docente = await this.docenteService.findOne(
      createFolderDto.docenteId,
    );

    if (!docente) {
      throw new BadRequestException('Docente no encontrado');
    }

    const savedFolder = await this.folderRepository.save({
      docente,
      ...createFolderDto,
    });

    await this.folderHistoryRepository.save({
      folder: savedFolder,
      state: createFolderDto.state,
      originFile: createFolderDto.originFile,
      location: createFolderDto.location,
      details: createFolderDto.details,
      observations: createFolderDto.observations,
      income_date: createFolderDto.income_date,
      outcome_date: createFolderDto.outcome_date,
    });
    return savedFolder;
  }

  async findAll(originFile: number) {
    return await this.folderRepository.find({ where: { originFile } });
  }

  async findOne(id: string) {
    const folder = await this.folderRepository.findOneBy({ id });

    if (!folder) {
      throw new NotFoundException(`Carpeta con ID ${id} no encontrada`);
    }
    return folder;
  }

  async update(id: string, updateFolderDto: UpdateFolderDto, user_dni: any) {
    try {
      // obtengo el turno a actualizar
      const folder = await this.findOne(id);

      if (!folder) {
        throw new BadRequestException('Carpeta no encontrada');
      }

      const { docenteId, ...dataTosend } = updateFolderDto;
      const test = await this.folderRepository.update(id, {
        docente: folder.docente,
        ...dataTosend,
      });

      const updatedFolder = await this.findOne(id);

      const user = await this.usersService.findOneByDni(user_dni.dni);
      const dataHistory = {
        folder: updatedFolder,
        state: updatedFolder.state,
        originFile: updatedFolder.originFile,
        location: updatedFolder.location,
        details: updatedFolder.details,
        observations: updatedFolder.observations,
        income_date: updatedFolder.income_date,
        outcome_date: updatedFolder.outcome_date,
        user: user,
      };

      const test2 = await this.folderHistoryRepository.save(dataHistory);

      return test;
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: string) {
    const result = await this.folderRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Carpeta con ID ${id} no encontrada`);
    }
  }

  // shearch all docentes's folders, if not exits, will create
  async createFolders() {
    const docentes = await this.docenteService.findAll();

    for (const docente of docentes) {
      // Check if folders exist
      const checkIfExistIngresoFolder = await this.folderRepository.findOne({
        where: {
          docente: { id: docente.id },
          originFile: 1,
        },
      });

      const checkIfExistTitularesFolder = await this.folderRepository.findOne({
        where: {
          docente: { id: docente.id },
          originFile: 2,
        },
      });

      // If not, will create
      const newFolders = []; // Array to save new folders

      if (!checkIfExistIngresoFolder) {
        const newIngresoFolder = await this.create({
          docenteId: docente.id,
          originFile: 1,
          state: 1,
        });
        newFolders.push(newIngresoFolder); // add new folder
      }

      if (!checkIfExistTitularesFolder) {
        const newTitularesFolder = await this.create({
          docenteId: docente.id,
          originFile: 2,
          state: 1,
        });
        newFolders.push(newTitularesFolder); // add new folder
      }

      // Assign all new folders to the teacher
      if (newFolders.length > 0) {
        // Actualizar el docente con las nuevas carpetas
        for (const newFolder of newFolders) {
          newFolder.docente = docente;
          await this.folderRepository.save(newFolder);
        }
      }
    }
    return true;
  }
}
