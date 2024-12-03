import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../presenters/dto/create-user.dto';
import { UpdateUserDto } from '../../presenters/dto/update-user.dto';
import { UsersDomainService } from 'src/users/domain/services/users.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto.ts';

@Injectable()
export class UsersApplicationService {
  constructor(private readonly usersDomainService: UsersDomainService) {}

  async create(createUserDto: CreateUserDto) {
    return await this.usersDomainService.create(createUserDto);
  }

  findAll(paginationQueryDto: PaginationQueryDto) {
    return this.usersDomainService.findAll(paginationQueryDto);
  }

  findOne(id: number) {
    return this.usersDomainService.findOne(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersDomainService.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.usersDomainService.remove(id);
  }
}
