import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, ILike } from 'typeorm';
import { UserEntity } from '@users/infrastructure/adapters/typeorm/entities/user.entity';
import { User } from '@users/domain/entities/user';
import {
  UserRepository,
  PaginationOptions,
} from '@users/application/ports/outbound/user.repository';
import { UserMapper } from '../mappers/user.mapper';
import { PageableService } from '@common/services/pageable.service';
import { PaginatedResult } from '@common/infrastructure/interfaces/commons.interface';
import { UserAlreadyExistsException } from '@users/domain/exceptions/user-already-exists.exception';
import { UserNotFoundByEmailException } from '@users/domain/exceptions/user-not-found-by-email.exception';
import { UserNotFoundException } from '@users/domain/exceptions/user-not-found.exception';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  private readonly logger = new Logger(TypeOrmUserRepository.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    private readonly pageableService: PageableService,
  ) {}

  async findById(id: number): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async getById(id: number): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new UserNotFoundException();
    return user;
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) throw new UserNotFoundByEmailException();
    return user;
  }

  async findAllPaginated(
    options: PaginationOptions,
  ): Promise<PaginatedResult<User>> {
    const where: any = {};

    if (options.filters?.name) {
      where.name = ILike(`%${options.filters.name}%`);
    }
    if (options.filters?.lastname) {
      where.lastname = ILike(`%${options.filters.lastname}%`);
    }
    if (options.filters?.roleId) {
      where.role = { id: options.filters.roleId };
    }

    const [entities, total] = await this.repository.findAndCount({
      where,
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: { id: 'DESC' },
    });

    return this.pageableService.getPages({
      data: entities.map(UserMapper.toDomain),
      total,
      page: options.page,
      limit: options.limit,
    });
  }

  async save(user: User): Promise<User> {
    try {
      const persistence = UserMapper.toPersistence(user);
      const saved = await this.repository.save(persistence);
      return UserMapper.toDomain(saved);
    } catch (error) {
      let errorException = error;
      if (error.code === '23505') {
        errorException = new UserAlreadyExistsException();
      }

      throw errorException;
    }
  }

  async delete(userId: number): Promise<void> {
    await this.repository.softDelete({ id: userId });
    this.logger.debug(`User ${userId} deleted`);
  }

  async deleteMany(userIds: number[]): Promise<void> {
    await this.repository.softDelete({ id: In(userIds) });
    this.logger.debug(`${userIds.length} users deleted`);
  }
}
