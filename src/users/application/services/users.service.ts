import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersDomainService } from 'src/users/domain/services/users.service';

@Injectable()
export class UsersApplicationService {
  constructor(private readonly usersDomainService: UsersDomainService) {}

  async create(createUserDto: CreateUserDto) {
    return await this.usersDomainService.create(createUserDto);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersDomainService.update(id, updateUserDto);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
