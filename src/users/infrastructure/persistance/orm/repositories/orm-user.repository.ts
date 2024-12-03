import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/infrastructure/persistance/orm/entities/user.entity';
import { UserRepository } from 'src/users/domain/repositories/user.repository';
import { DeleteResult, Repository } from 'typeorm';
import { UserMapper } from '../mappers/user.mapper';
import { User } from 'src/users/domain/user';
import {
  IFind,
  PaginatedResult,
} from 'src/common/interfaces/commons.interface';

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
    return this.userRepository.create(user);
  }

  async findOne({
    where,
    relations,
  }: {
    where: object;
    relations: string[];
  }): Promise<User> {
    const entity = await this.userRepository.findOne({ where, relations });
    return UserMapper.toDomain(entity);
  }

  async find({
    where,
    relations,
    start,
    limit,
  }: IFind): Promise<PaginatedResult<User>> {
    const [roles, total] = await this.userRepository.findAndCount({
      where,
      relations,
      skip: start,
      take: limit,
    });

    return {
      data: roles.map((role) => UserMapper.toDomain(role)),
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.userRepository.delete({ id });
  }
}
