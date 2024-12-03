import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/application/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/application/dto/update-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../user';
import { Role } from '../role';
import { HashingService } from 'src/iam/infrastructure/hashing/hashing.service';

@Injectable()
export class UsersDomainService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    const role = new Role(createUserDto.role);
    user.email = createUserDto.email;
    user.password = await this.hashingService.hash(createUserDto.password);
    user.role = role;

    return this.userRepository.create(user);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${JSON.stringify(updateUserDto)} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
