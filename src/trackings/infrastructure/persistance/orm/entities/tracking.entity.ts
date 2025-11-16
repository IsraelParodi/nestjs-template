import { AuditEntity } from '@common/entities/audit.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ContainerEntity } from './container.entity';
import { SealEntity } from './seal.entity';
import { UserEntity } from '@users/infrastructure/persistance/orm/entities/user.entity';

@Entity('trackings')
export class TrackingEntity extends AuditEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id', type: 'int' })
  id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'consignee_id' })
  consignee: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'notifier_id' })
  notifier: UserEntity;

  @Column()
  shipper: string;

  @Column({ unique: true })
  routing: string;

  @Column({ name: 'customs_office' })
  customsOffice: string;

  @Column({ name: 'bl_authorization' })
  blAuthorization: string;

  @Column()
  regime: string;

  @Column({ name: 'mbl_mawb', unique: true })
  mbl_mawb: string;

  @Column({ name: 'hbl_mawb', unique: true })
  hbl_mawb: string;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column({ type: 'timestamp' })
  etd: Date;

  @Column({ type: 'timestamp' })
  eta: Date;

  @OneToMany(() => ContainerEntity, (container) => container.tracking, { cascade: true })
  containers: ContainerEntity[];

  @OneToMany(() => SealEntity, (seal) => seal.tracking, { cascade: true })
  seals: SealEntity[];
}
