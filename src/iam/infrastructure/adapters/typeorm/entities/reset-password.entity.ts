import { AuditEntity } from '@common/infrastructure/persistance/entities/audit.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reset_passwords')
export class ResetPasswordEntity extends AuditEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  token: string;
}
