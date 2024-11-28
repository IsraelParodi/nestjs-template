import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { AuditEntity } from '@iam/infrastructure/persistance/orm/entities/audit.entity';

@Entity('permissions')
export class PermissionEntity extends AuditEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  @JoinColumn({ name: 'role_id' })
  roles: RoleEntity[];
}
