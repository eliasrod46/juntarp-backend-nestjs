import { Ciclo } from '../../ciclo/entities/ciclo.entity';
import { Docente } from '../../docentes/entities/docente.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TurnoType } from './turnoType.entity';

@Entity()
export class Turno {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  inscription_type: string;

  @Column()
  date: string;

  @Column()
  time: string;

  @ManyToOne(() => Ciclo, (ciclo) => ciclo.id, { nullable: false, eager: true })
  ciclo: Ciclo;

  @ManyToOne(() => Docente, (docente) => docente.id, {
    eager: true,
    nullable: true,
  })
  docente: Docente;

  @ManyToOne(() => TurnoType, (turnoType) => turnoType.id, {
    eager: true,
    nullable: false,
  })
  turnoType: TurnoType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
