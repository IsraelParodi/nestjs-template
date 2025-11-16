import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { AuditEntity } from '../../../../../common/infrastructure/persistance/entities/audit.entity';

@Entity('permissions')
export class PermissionEntity extends AuditEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles: RoleEntity[];
}

import { RoleEntity } from './role.entity';
