import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@users/infrastructure/persistance/orm/entities/user.entity';
import { UserRepository } from '@users/domain/repositories/user.repository';
import { DeleteResult, Repository } from 'typeorm';
import { UserMapper } from '../mappers/user.mapper';
import { User } from '@users/domain/user';
import {
  IFind,
  IFindOne,
  PaginatedResult,
} from '@common/interfaces/commons.interface';

@Injectable()
export class OrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async save(user: User): Promise<User> {
    const persistenceModel = UserMapper.toPersistence(user);
    const newEntity = await this.userRepository.save(persistenceModel);

    return UserMapper.toDomain(newEntity);
  }

  async create(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async findOne({ where, relations, select }: IFindOne<User>): Promise<User> {
    const entity = await this.userRepository.findOne({
      where,
      relations,
      select,
    });

    if (!entity) {
      throw new NotFoundException(`User with ID ${where.id} not found`);
    }

    return UserMapper.toDomain(entity);
  }

  async find({
    where,
    relations,
    start,
    limit,
  }: IFind): Promise<PaginatedResult<User>> {
    const [users, total] = await this.userRepository.findAndCount({
      where,
      relations,
      skip: start,
      take: limit,
    });

    return {
      data: users.map((role) => UserMapper.toDomain(role)),
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.userRepository.delete({ id });
  }
}
