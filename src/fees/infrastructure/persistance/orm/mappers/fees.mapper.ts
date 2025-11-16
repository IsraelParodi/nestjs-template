import { Fee } from '@fees/domain/fee';
import { FeeEntity } from '../entities/fee.entity';
import { ContainerMapper } from './containers.mapper';
import { ExpenseMapper } from './expenses.mapper';
import { UserMapper } from '@users/infrastructure/persistance/orm/mappers/user.mapper';

export class FeeMapper {
  static toDomain(feeEntity: FeeEntity): Fee {
    const fee = new Fee(feeEntity.id);

    fee.name = feeEntity.name;
    fee.startDate = feeEntity.startDate;
    fee.endDate = feeEntity.endDate;
    fee.currency = feeEntity.currency;
    fee.regime = feeEntity.regime;
    fee.customsOffice = feeEntity.customsOffice;
    fee.shipmentType = feeEntity.shipmentType;
    fee.origin = feeEntity.origin;
    fee.destination = feeEntity.destination;

    fee.containers = feeEntity.containers?.map(ContainerMapper.toDomain) ?? [];
    fee.expenses = feeEntity.expenses?.map(ExpenseMapper.toDomain) ?? [];

    if (fee.containers.length > 0 && fee.expenses.length > 0) {
      const containers = fee.containers;
      const expenses = fee.expenses;

      const minAmountContainer = Math.min(...containers.map(container => container.amount));
      const totalAmountExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

      fee.amount = minAmountContainer + totalAmountExpenses;
    }

    fee.notes = feeEntity.notes;
    fee.observations = feeEntity.observations;

    fee.createdAt = feeEntity.createdAt;
    fee.createdBy = UserMapper.mapUserReferenceToDomain(feeEntity.createdBy);
    fee.updatedAt = feeEntity.updatedAt;
    fee.updatedBy = UserMapper.mapUserReferenceToDomain(feeEntity.updatedBy);

    return fee;
  }

  static toPersistence(fee: Fee): FeeEntity {
    const entity = new FeeEntity();

    entity.id = fee.id;
    entity.name = fee.name;
    entity.startDate = fee.startDate;
    entity.endDate = fee.endDate;
    entity.currency = fee.currency;
    entity.regime = fee.regime;
    entity.customsOffice = fee.customsOffice;
    entity.shipmentType = fee.shipmentType;
    entity.origin = fee.origin;
    entity.destination = fee.destination;

    entity.containers = fee.containers?.map(ContainerMapper.toPersistence) ?? [];
    entity.expenses = fee.expenses?.map(ExpenseMapper.toPersistence) ?? [];

    entity.notes = fee.notes;
    entity.observations = fee.observations;

    entity.createdBy = UserMapper.mapUserReferenceToPersistence(fee.createdBy);
    entity.createdAt = fee.createdAt;
    entity.updatedBy = UserMapper.mapUserReferenceToPersistence(fee.createdBy);
    entity.updatedAt = fee.updatedAt;

    return entity;
  }
}
