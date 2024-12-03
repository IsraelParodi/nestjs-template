import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/infrastructure/persistance/orm/entities/user.entity';
import { UserRepository } from 'src/users/domain/repositories/user.repository';
import { Repository } from 'typeorm';
import { UserMapper } from '../mappers/user.mapper';
import { User } from 'src/users/domain/user';

@Injectable()
export class OrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(user: User): Promise<User> {
    const persistenceModel = UserMapper.toPersistence(user);

    const newEntity = await this.userRepository.save(persistenceModel);

    return UserMapper.toDomain(newEntity);
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
}
