import { FolderHistory } from 'src/modules/archivo/entities/folderHistory.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  dni: string;

  @Column({ nullable: false })
  lastname: string;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: 'user' })
  rol: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  get fullName(): string {
    return `${this.lastname}, ${this.name} - ${this.dni}`;
  }

  @OneToMany(() => User, (user) => user.folderHistory)
  folderHistory: FolderHistory[];
}
