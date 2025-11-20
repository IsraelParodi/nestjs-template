import { AuditEntity } from '@common/entities/audit.entity';
import { RoleEntity } from '@iam/infrastructure/persistance/orm/entities/role.entity';
import { CountryEntity } from '@localities/infrastructure/persistance/orm/entities/country.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity extends AuditEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => RoleEntity, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column({ name: 'business_tax_id' })
  businessTaxId: string;

  @Column({ name: 'legal_name' })
  legalName: string;

  @ManyToOne(() => CountryEntity, { eager: true })
  @JoinColumn({ name: 'country' })
  country?: CountryEntity;

  @Column({ nullable: true, name: 'phone_code' })
  phoneCode?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address?: string;
}
