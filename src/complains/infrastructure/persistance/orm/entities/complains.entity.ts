import { ComplainsStatus } from '@complains/infrastructure/enums/complains-status.enum';
import { AuditEntity } from '@common/entities/audit.entity';
import { CountryEntity } from '@localities/infrastructure/persistance/orm/entities/country.entity';
import { StateEntity } from '@localities/infrastructure/persistance/orm/entities/states.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('complains')
export class ComplainsEntity extends AuditEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'code', unique: true, nullable: true })
  code: string;

  @Column({
    name: 'status',
    enum: ComplainsStatus,
    default: ComplainsStatus.PENDING,
  })
  status: ComplainsStatus;

  @Column({ name: 'national_taxpayer_registry' })
  nationalTaxpayerRegistry: string;

  @Column({ name: 'company_name' })
  companyName: string;

  @Column({ name: 'document_type' })
  documentType: string;

  @Column({ name: 'document_number' })
  documentNumber: string;

  @Column({ name: 'complainer_name' })
  complainerName: string;

  @Column({ name: 'complainer_address' })
  complainerAddress: string;

  @Column({ name: 'complainer_district' })
  complainerDistrict: string;

  @Column({ name: 'complainer_phone' })
  complainerPhone: string;

  @Column({ name: 'complainer_phone_code' })
  complainerPhoneCode: string;

  @Column({ name: 'complainer_email' })
  complainerEmail: string;

  @ManyToOne(() => StateEntity, { eager: true })
  @JoinColumn({ name: 'complainer_state' })
  complainerState: StateEntity;

  @ManyToOne(() => CountryEntity, { eager: true })
  @JoinColumn({ name: 'complainer_country' })
  complainerCountry: CountryEntity;

  @Column({ name: 'service_type' })
  serviceType: string;

  @Column({ name: 'currency' })
  currency: string;

  @Column({ name: 'amount_complained', type: 'decimal' })
  amountComplained: number;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'type' })
  type: string;

  @Column({ name: 'detail' })
  detail: string;

  @Column({ name: 'request' })
  request: string;

  @Column({ name: 'emails_copied', type: 'simple-array', default: '' })
  emailsCopied: string[];
}
