import { Expense } from '@fees/domain/expense';
import { ExpenseEntity } from '../entities/expense.entity';
import { FeeMapper } from './fees.mapper';

export class ExpenseMapper {
  static toDomain(expenseEntity: ExpenseEntity): Expense {
    const expense = new Expense(Number(expenseEntity.id));

    expense.unit = expenseEntity.unit;
    expense.description = expenseEntity.description;
    expense.amount = Number(expenseEntity.amount);
    expense.title = expenseEntity.title;
    expense.fee = expenseEntity.fee ? FeeMapper.toDomain(expenseEntity.fee) : undefined;
    expense.createdAt = expenseEntity.createdAt;
    expense.updatedAt = expenseEntity.updatedAt;

    return expense;
  }

  static toPersistence(expense: Expense): ExpenseEntity {
    const entity = new ExpenseEntity();

    entity.id = expense.id || undefined;
    entity.unit = expense.unit;
    entity.title = expense.title;
    entity.amount = expense.amount;
    entity.description = expense.description;
    entity.fee = expense.fee ? FeeMapper.toPersistence(expense.fee) : undefined;
    entity.createdAt = expense.createdAt;
    entity.updatedAt = expense.updatedAt;

    return entity;
  }
}
