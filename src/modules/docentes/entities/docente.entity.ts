import { Turno } from '../../turnos/entities/turno.entity';
import { Folder } from '../../archivo/entities/folder.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Docente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  dni: string;

  @OneToMany(() => Turno, (turno) => turno.docente)
  turnos: Turno[];

  @OneToMany(() => Folder, (folder) => folder.docente)
  folders: Folder[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date; // Cambiado a Date y opcional

  get fullName(): string {
    return `${this.lastname}, ${this.name} - ${this.dni}`;
  }
}
