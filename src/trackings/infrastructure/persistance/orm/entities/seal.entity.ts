import { AuditEntity } from '@common/entities/audit.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TrackingEntity } from './tracking.entity';

@Entity('trackings_seals')
export class SealEntity extends AuditEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id', type: 'int' })
  id: number;

  @Column()
  name: string;

  @Column({ name: 'container_code' })
  containerCode: string;

  @Column()
  description: string;

  @ManyToOne(() => TrackingEntity, (tracking) => tracking.seals)
  @JoinColumn({ name: 'tracking_id' })
  tracking: TrackingEntity;
}
