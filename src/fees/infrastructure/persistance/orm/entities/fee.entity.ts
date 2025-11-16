import { AuditEntity } from '@common/entities/audit.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ContainerEntity } from './container.entity';
import { ExpenseEntity } from './expense.entity';

@Entity('fees')
export class FeeEntity extends AuditEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id', type: 'int' })
  id: number;

  @Column()
  name: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column()
  currency: string;

  @Column()
  regime: string;

  @Column({ name: 'customs_office' })
  customsOffice: string;

  @Column()
  shipmentType: string;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @OneToMany(() => ContainerEntity, (container) => container.fee, {
    cascade: true,
  })
  containers: ContainerEntity[];

  @OneToMany(() => ExpenseEntity, (expense) => expense.fee, { cascade: true })
  expenses: ExpenseEntity[];

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  observations: string;
}
