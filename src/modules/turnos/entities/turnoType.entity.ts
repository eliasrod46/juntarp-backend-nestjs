import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Turno } from './turno.entity';
import { Ciclo } from '../../ciclo/entities/ciclo.entity';

@Entity()
export class TurnoType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  quantity_dates: number;

  @OneToMany(() => Turno, (turno) => turno.ciclo)
  turnos: Turno[];

  @ManyToOne(() => Ciclo, (ciclo) => ciclo.id, { eager: true })
  ciclo: Ciclo;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
