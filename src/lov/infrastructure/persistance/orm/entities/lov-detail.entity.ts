import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AuditEntity } from '@common/entities/audit.entity';
import { ListOfValuesEntity } from './lov.entity';

@Entity('lov_detail')
export class ListOfValuesDetailEntity extends AuditEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => ListOfValuesEntity, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'key_id' })
  key: ListOfValuesEntity;

  @Column()
  name: string;

  @Column()
  detail: string;
}
