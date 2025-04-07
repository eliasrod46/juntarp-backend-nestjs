

import { Turno } from '../../turnos/entities/turno.entity';
import { TurnoType } from '../../turnos/entities/turnoType.entity';
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
export class Ciclo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'date' })
  end_date: string;

  @Column({ nullable: true })
  details: string;

  @Column({ type: 'boolean', default: 0 })
  status: boolean;
  
  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
  
  @DeleteDateColumn()
  deletedAt: string;

  // ==> relationships
  @OneToMany(() => Turno, (turno) => turno.ciclo)
  turnos: Turno[];

  @OneToMany(() => TurnoType, (turnoType) => turnoType.ciclo)
  turnostypes: TurnoType[];
}
