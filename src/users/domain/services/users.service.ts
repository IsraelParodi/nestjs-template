import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from '@users/presenters/dto/create-user.dto';
import { UpdateUserDto } from '@users/presenters/dto/update-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../user';
import { Role } from '../role';
import { HashingService } from '@iam/infrastructure/hashing/hashing.service';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto.ts';
import { RolesDomainService } from '@iam/domain/services/roles.service';
import { IFindOne } from '@common/interfaces/commons.interface';

@Injectable()
export class UsersDomainService {
  private readonly logger = new Logger(UsersDomainService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleService: RolesDomainService,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Valida la existencia del rol
    const [roleFound, creator] = await Promise.all([
      this.roleService.findOne(createUserDto.role),
      createUserDto.createdBy &&
        this.userRepository.findOne({
          where: { id: createUserDto.createdBy },
        }),
    ]);

    this.logger.debug(`Role found: ${JSON.stringify(roleFound)}`);

    const user = new User();
    const role = new Role(createUserDto.role);
    user.email = createUserDto.email;
    user.password = await this.hashingService.hash(createUserDto.password);
    user.role = role;

    if (createUserDto.createdBy) {
      user.createdBy = creator;
    }

    const result = await this.userRepository.create(user);

    return this.userRepository.findOne({
      where: { id: result.id },
      relations: ['createdBy', 'updatedBy'],
      select: {
        id: true,
        email: true,
        updatedAt: true,
        createdAt: true,
        deletedAt: true,
      },
    });
  }

  findAll({ start, limit }: PaginationQueryDto) {
    return this.userRepository.find({ start, limit });
  }

  findOne({ where, relations, select }: IFindOne<User>) {
    return this.userRepository.findOne({ where, relations, select });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy', 'deletedBy'],
    });

    const [roleFound, updater] = await Promise.all([
      updateUserDto.role && this.roleService.findOne(updateUserDto.role),
      updateUserDto.updatedBy &&
        this.userRepository.findOne({
          where: { id: updateUserDto.updatedBy },
        }),
    ]);

    this.logger.debug(`Role found: ${JSON.stringify(roleFound)}`);

    Object.assign(user, updateUserDto);
    user.updatedBy = updater;
    return this.userRepository.save(user);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
