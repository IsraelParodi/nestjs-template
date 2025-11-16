import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ContactUsMapper } from '../mappers/contact-us.mapper';
import { PaginatedResult } from '@common/infrastructure/interfaces/commons.interface';
import { ContactUsEntity } from '../entities/contact-us.entity';
import { ContactUs } from '@contact-us/domain/contact-us';
import { PageableService } from '@common/services/pageable.service';
import {
  ContactUsRepository,
  PaginationOptions,
} from '@contact-us/application/ports/outbound/contact-us.repository';

@Injectable()
export class OrmContactUsRepository implements ContactUsRepository {
  constructor(
    @InjectRepository(ContactUsEntity)
    private readonly contactUsRepository: Repository<ContactUsEntity>,
    private readonly pageableService: PageableService,
  ) {}

  async save(contactUs: ContactUs): Promise<ContactUs> {
    const persistenceModel = ContactUsMapper.toPersistence(contactUs);
    const newEntity = await this.contactUsRepository.save(persistenceModel);

    return ContactUsMapper.toDomain(newEntity);
  }

  async findById(id: number): Promise<ContactUs> {
    const entity = await this.contactUsRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!entity) {
      throw new NotFoundException(`ContactUs with ID ${id} not found`);
    }

    return ContactUsMapper.toDomain(entity);
  }

  async findAllPaginated(
    options: PaginationOptions,
  ): Promise<PaginatedResult<ContactUs>> {
    const [users, total] = await this.contactUsRepository.findAndCount({
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: { id: 'DESC' },
    });

    const data = users.map((entity) => ContactUsMapper.toDomain(entity));

    return this.pageableService.getPages({
      data,
      total,
      page: options.page,
      limit: options.limit,
    });
  }

  async delete(id: number, deletedBy: number): Promise<void> {
    await this.contactUsRepository.update(
      { id },
      { deletedBy: deletedBy as any },
    );
    await this.contactUsRepository.softDelete({ id });
  }

  async deleteMany(contactUsIds: number[], deletedBy: number): Promise<void> {
    await this.contactUsRepository.update(
      { id: In(contactUsIds) },
      { deletedBy: deletedBy as any },
    );
    await this.contactUsRepository.softDelete({ id: In(contactUsIds) });
  }
}
