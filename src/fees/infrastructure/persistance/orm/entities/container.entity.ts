import { AuditEntity } from '@common/entities/audit.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FeeEntity } from './fee.entity';

@Entity('fees_containers')
export class ContainerEntity extends AuditEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id', type: 'int' })
  id: number;

  @Column()
  size: string;

  @Column({ type: 'decimal' })
  amount: number;

  @ManyToOne(() => FeeEntity, (fee) => fee.containers)
  fee: FeeEntity;
}
