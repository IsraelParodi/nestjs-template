import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository } from 'typeorm';
import { ContactUsMapper } from '../mappers/contact-us.mapper';
import { IFind, IFindOne, PaginatedResult } from '@common/interfaces/commons.interface';
import { ContactUsEntity } from '../entities/contact-us.entity';
import { ContactUs } from '@contact-us/domain/contact-us';
import { ContactUsRepository } from '@contact-us/domain/repositories/contact-us.repository';
import { PageableService } from '@common/services/pageable.service';
import { DeleteManyDto } from '@common/dto/delete-many.dto';
import { UserEntity } from '@users/infrastructure/persistance/orm/entities/user.entity';

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

  async update(contactUs: ContactUs): Promise<ContactUs> {
    const persistenceModel = ContactUsMapper.toPersistence(contactUs);

    await this.contactUsRepository.save(persistenceModel);

    return ContactUsMapper.toDomain(persistenceModel);
  }

  async create(contactUs: ContactUs): Promise<ContactUs> {
    return this.contactUsRepository.save(contactUs);
  }

  async findOne({ where, relations, select }: IFindOne<ContactUs>): Promise<ContactUs> {
    const entity = await this.contactUsRepository.findOne({
      where,
      relations,
      select,
      withDeleted: true,
    });

    if (!entity) {
      throw new NotFoundException(`ContactUs with ID ${where.id} not found`);
    }

    return ContactUsMapper.toDomain(entity);
  }

  async find({ where, relations, start, limit }: IFind): Promise<PaginatedResult<ContactUs>> {
    const [contactUs, total] = await this.contactUsRepository.findAndCount({
      where,
      relations,
      skip: start,
      take: limit,
    });

    const data = contactUs.map((contactUs) => ContactUsMapper.toDomain(contactUs));

    return this.pageableService.getPages({ data, total, start, limit });
  }

  async delete(id: number, deletedBy: Partial<UserEntity>): Promise<DeleteResult> {
    await this.contactUsRepository.update({ id }, { deletedBy });
    return this.contactUsRepository.softDelete({ id });
  }

  async deleteMany(deleteManyDto: DeleteManyDto, deletedBy: Partial<UserEntity>): Promise<DeleteResult> {
    const { ids } = deleteManyDto;
    await this.contactUsRepository.update({ id: In(ids) }, { deletedBy: deletedBy });
    return this.contactUsRepository.softDelete({ id: In(ids) });
  }

  async restore(id: number): Promise<DeleteResult> {
    return this.contactUsRepository.restore({ id });
  }
}
