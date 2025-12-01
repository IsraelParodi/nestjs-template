import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@users/infrastructure/persistance/orm/entities/user.entity';
import { UserRepository } from '@users/domain/repositories/user.repository';
import { DeleteResult, In, Repository } from 'typeorm';
import { UserMapper } from '../mappers/user.mapper';
import { User } from '@users/domain/user';
import {
  IFind,
  IFindOne,
  PaginatedResult,
} from '@common/interfaces/commons.interface';
import { PageableService } from '@common/services/pageable.service';
import { DeleteManyDto } from '@common/dto/delete-many.dto';

@Injectable()
export class OrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly pageableService: PageableService,
  ) { }

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

    const details = Object.entries(where)
      .map(([key, value]) => `${key}=${typeof value === 'object' ? JSON.stringify(value) : value}`)
      .join(', ');


    if (!entity) {
      throw new NotFoundException(`User with ${details} not found`);
    }

    return UserMapper.toDomain(entity);
  }

  async find({
    where,
    relations,
    select,
    start,
    limit,
  }: IFind): Promise<PaginatedResult<User>> {
    const [users, total] = await this.userRepository.findAndCount({
      where,
      relations,
      select,
      skip: start,
      take: limit,
      order: { id: 'DESC' },
    });

    const data = users.map((role) => UserMapper.toDomain(role));

    return this.pageableService.getPages({ data, total, start, limit });
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.userRepository.softDelete({ id });
  }

  async deleteMany(
    deleteUserDto: DeleteManyDto,
    deletedBy: Partial<UserEntity>,
  ): Promise<DeleteResult> {
    const { ids } = deleteUserDto;
    await this.userRepository.update({ id: In(ids) }, { deletedBy: deletedBy });
    return this.userRepository.softDelete({ id: In(ids) });
  }
}
