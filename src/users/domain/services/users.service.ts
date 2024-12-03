import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/presenters/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/presenters/dto/update-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../user';
import { Role } from '../role';
import { HashingService } from 'src/iam/infrastructure/hashing/hashing.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto.ts';
import { RoleRepository } from 'src/iam/domain/repositories/role.repository';

@Injectable()
export class UsersDomainService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.roleRepository.findOne({ where: { id: createUserDto.role } });
    const user = new User();
    const role = new Role(createUserDto.role);
    user.email = createUserDto.email;
    user.password = await this.hashingService.hash(createUserDto.password);
    user.role = role;

    return this.userRepository.create(user);
  }

  findAll({ start, limit }: PaginationQueryDto) {
    return this.userRepository.find({ start, limit });
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
