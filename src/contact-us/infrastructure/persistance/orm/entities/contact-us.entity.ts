import { AuditEntity } from '@common/entities/audit.entity';
import { CountryEntity } from '@localities/infrastructure/persistance/orm/entities/country.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('contact-us')
export class ContactUsEntity extends AuditEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'lastname' })
  lastname: string;

  @ManyToOne(() => CountryEntity, { eager: true })
  @JoinColumn({ name: 'country' })
  country: CountryEntity;

  @Column({ name: 'phone_code', nullable: true })
  phoneCode: string;

  @Column({ name: 'phone' })
  phone: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'message', type: 'text' })
  message: string;

  @Column({ name: 'accept_privacy_policies', default: true })
  acceptPrivacyPolicies: boolean;

  @Column({ name: 'receive_additional_information', default: false })
  receiveAdditionalInformation: boolean;
}
