import { AuditEntity } from '@common/entities/audit.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FeeEntity } from './fee.entity';

@Entity('fees_expenses')
export class ExpenseEntity extends AuditEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id', type: 'int' })
  id: number;

  @Column()
  unit: string;

  @Column({ type: 'decimal', nullable: true })
  amount: number;

  @Column({ nullable: true })
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => FeeEntity, (fee) => fee.expenses)
  fee: FeeEntity;
}
