import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ResetPasswordRepository } from '@iam/domain/repositories/reset-password.repository';
import { ResetPassword } from '@iam/domain/reset-password';
import { ResetPasswordMapper } from '../mappers/reset-password.mapper';
import { ResetPasswordEntity } from '../entities/reset-password.entity';
import { PageableService } from '@common/services/pageable.service';

@Injectable()
export class OrmResetPasswordRepository implements ResetPasswordRepository {
  constructor(
    @InjectRepository(ResetPasswordEntity)
    private readonly resetPasswordRepository: Repository<ResetPasswordEntity>,
    private readonly pageableService: PageableService,
  ) {}

  async save(resetPassword: ResetPassword): Promise<ResetPassword> {
    const persistenceModel = ResetPasswordMapper.toPersistence(resetPassword);
    const newEntity = await this.resetPasswordRepository.save(persistenceModel);

    return ResetPasswordMapper.toDomain(newEntity);
  }

  async findOne({
    where,
    relations,
  }: {
    where: object;
    relations: string[];
  }): Promise<ResetPassword> {
    const entity = await this.resetPasswordRepository.findOne({
      where,
      relations,
    });

    if (entity) {
      return ResetPasswordMapper.toDomain(entity);
    }
  }

  async delete(token: string): Promise<DeleteResult> {
    return this.resetPasswordRepository.delete({ token });
  }
}
