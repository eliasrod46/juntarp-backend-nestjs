import { Docente } from '../../docentes/entities/docente.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FolderHistory } from './folderHistory.entity';

@Entity()
export class Folder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Docente, (docente) => docente.folders, {
    eager: true,
  })
  docente: Docente;

  @Column({ type: 'tinyint', default: 1 }) //1 active; 2 pasiveFile; 3 out of file
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

  @DeleteDateColumn()
  deletedAt: Date;

  // Relación uno a muchos con FolderHistory
  @OneToMany(() => FolderHistory, (folderHistory) => folderHistory.folder, {
    eager: true,
  })
  history: FolderHistory[];
}
