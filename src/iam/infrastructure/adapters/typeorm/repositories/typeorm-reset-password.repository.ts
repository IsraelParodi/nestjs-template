import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResetPassword } from '@iam/domain/entities/reset-password';
import { ResetPasswordMapper } from '../mappers/reset-password.mapper';
import { ResetPasswordEntity } from '../entities/reset-password.entity';
import { PageableService } from '@common/services/pageable.service';
import { ResetPasswordRepository } from '@iam/application/ports/outbound/reset-password.repository';

@Injectable()
export class TypeOrmResetPasswordRepository implements ResetPasswordRepository {
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

  async findByEmail(email: string): Promise<ResetPassword> {
    const entity = await this.resetPasswordRepository.findOne({
      where: { email },
    });

    if (entity) {
      return ResetPasswordMapper.toDomain(entity);
    }
  }

  async findByToken(token: string): Promise<ResetPassword> {
    const entity = await this.resetPasswordRepository.findOne({
      where: { token },
    });

    if (entity) {
      return ResetPasswordMapper.toDomain(entity);
    }
  }

  async delete(token: string): Promise<void> {
    await this.resetPasswordRepository.delete({ token });
  }
}
