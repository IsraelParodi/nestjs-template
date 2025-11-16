import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class UnitOfWork {
  constructor(private readonly dataSource: DataSource) {}

  async execute<T>(work: (manager: EntityManager) => Promise<T>): Promise<T> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const result = await work(qr.manager);
      await qr.commitTransaction();
      return result;
    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }
  }
}
