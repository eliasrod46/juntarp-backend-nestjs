import { Docente } from '../../docentes/entities/docente.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Folder } from './folder.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Entity()
export class FolderHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relación muchos a uno con Folder
  @ManyToOne(() => Folder, (folder) => folder.history)
  folder: Folder;

  @ManyToOne(() => User, (user) => user.folderHistory)
  user: User;

  @Column({ type: 'tinyint', default: 0 })
  state: number;

  @Column({ type: 'tinyint', default: 1 })
  originFile: number;

  @Column({ type: 'varchar', nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @Column({ type: 'date', nullable: true })
  income_date: string;

  @Column({ type: 'date', nullable: true })
  outcome_date: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}