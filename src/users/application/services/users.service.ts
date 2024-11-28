import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../presenters/dto/create-user.dto';
import { UpdateUserDto } from '../../presenters/dto/update-user.dto';
import { UsersDomainService } from '@users/domain/services/users.service';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto.ts';
import { IFindOne } from '@common/interfaces/commons.interface';
import { User } from '@users/domain/user';

@Injectable()
export class UsersApplicationService {
  constructor(private readonly usersDomainService: UsersDomainService) {}

  async create(createUserDto: CreateUserDto) {
    return await this.usersDomainService.create(createUserDto);
  }

  findAll(paginationQueryDto: PaginationQueryDto) {
    return this.usersDomainService.findAll(paginationQueryDto);
  }

  findOne({ where, relations, select }: IFindOne<User>) {
    return this.usersDomainService.findOne({ where, relations, select });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersDomainService.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.usersDomainService.remove(id);
  }
}
