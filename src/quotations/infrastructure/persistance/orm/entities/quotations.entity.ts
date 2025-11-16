import { AuditEntity } from '@common/infrastructure/persistance/entities/audit.entity';
import { CountryEntity } from '@localities/infrastructure/adapters/typeorm/entities/country.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('quotations')
export class QuotationsEntity extends AuditEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'lastname' })
  lastname: string;

  @Column({ name: 'user_type' })
  userType: string;

  @ManyToOne(() => CountryEntity, { eager: true })
  @JoinColumn({ name: 'country' })
  country: CountryEntity;

  @Column({ name: 'document_type' })
  documentType: string;

  @Column({ name: 'document_number' })
  documentNumber: string;

  @Column({ name: 'phone_code', nullable: true })
  phoneCode: string;

  @Column({ name: 'phone' })
  phone: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'transport_type' })
  transportType: string;

  @Column({ name: 'shipping_type', nullable: true })
  shippingType: string;

  @Column({ name: 'cargo_volume', type: 'int', nullable: true })
  cargoVolume: number;

  @Column({ name: 'container_code', nullable: true })
  containerCode: string;

  @Column({ name: 'industry_type' })
  industryType: string;

  @Column({ name: 'origin' })
  origin: string;

  @Column({ name: 'destination' })
  destination: string;
}
