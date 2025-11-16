import { AuditEntity } from '@common/entities/audit.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ListOfValuesDetailEntity } from './lov-detail.entity';

@Entity('lov')
export class ListOfValuesEntity extends AuditEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  key: string;

  @Column()
  description: string;

  @OneToMany(() => ListOfValuesDetailEntity, (list_of_values_detail) => list_of_values_detail.key)
  values: ListOfValuesDetailEntity[];
}
