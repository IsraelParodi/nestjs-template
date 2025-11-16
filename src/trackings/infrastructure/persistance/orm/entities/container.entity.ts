import { AuditEntity } from '@common/entities/audit.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TrackingEntity } from './tracking.entity';

@Entity('trackings_containers')
export class ContainerEntity extends AuditEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id', type: 'int' })
  id: number;

  @Column()
  code: string;

  @Column()
  quantity: number;

  @Column()
  kbr: number;

  @Column()
  m3: number;

  @Column()
  description: string;

  @ManyToOne(() => TrackingEntity, (tracking) => tracking.containers)
  @JoinColumn({ name: 'tracking_id' })
  tracking: TrackingEntity;
}
