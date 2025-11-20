import { Injectable } from '@nestjs/common';
import { CreateContactUsDto } from '../../presenters/dto/create-contact-us.dto';
import { ContactUsDomainService } from '@contact-us/domain/services/contact-us.service';
import { IFindOne } from '@common/interfaces/commons.interface';
import { ContactUs } from '@contact-us/domain/contact-us';
import { DeleteManyDto } from '@common/dto/delete-many.dto';
import { PaginationQueryContactUsDto } from '@contact-us/presenters/dto/pagination-query-contact-us.dto';
import { ContactUsMapper } from '@contact-us/infrastructure/persistance/orm/mappers/contact-us.mapper';

@Injectable()
export class ContactUsApplicationService {
  constructor(
    private readonly contactUsDomainService: ContactUsDomainService,
  ) {}

  async create(createContactUsDto: CreateContactUsDto) {
    const contactUs = ContactUsMapper.fromDtotoDomain(createContactUsDto);

    return await this.contactUsDomainService.create(contactUs);
  }

  findAll(paginationQueryDto: PaginationQueryContactUsDto) {
    return this.contactUsDomainService.findAll(paginationQueryDto);
  }

  findOne({ where, relations, select }: IFindOne<ContactUs>) {
    return this.contactUsDomainService.findOne({
      where,
      relations,
      select,
    });
  }

  remove(id: number, deletedBy: number) {
    return this.contactUsDomainService.remove(id, deletedBy);
  }

  removeMany(deleteManyDto: DeleteManyDto, deletedBy: number) {
    return this.contactUsDomainService.removeMany(deleteManyDto, deletedBy);
  }
}
