// application/validators/quotation.validator.ts
import { CountryRepository } from '@localities/application/ports/outbound/country.repository';
import { ListOfValuesRepository } from '@lov/application/ports/outbound/lov.repository';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '@users/application/ports/outbound/user.repository';
import { ValidateQuotationCommand } from '../commands/validate-quotation.command';

@Injectable()
export class QuotationValidator {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly countryRepository: CountryRepository,
    private readonly listOfValuesRepository: ListOfValuesRepository,
  ) {}

  async run(input: ValidateQuotationCommand) {
    const {
      executorUserId,
      countryId,
      userType,
      industryType,
      transportType,
      documentType,
    } = input;

    const [
      executor,
      countryFound,
      userTypeFound,
      documentTypeFound,
      industryTypeFound,
      transportTypeFound,
    ] = await Promise.all([
      executorUserId ? this.userRepository.findById(executorUserId) : null,
      countryId ? this.countryRepository.findById(countryId) : null,
      userType
        ? this.listOfValuesRepository.findChildByName('user_type', userType)
        : null,
      documentType
        ? this.listOfValuesRepository.findChildByName(
            'document_type',
            documentType,
          )
        : null,
      industryType
        ? this.listOfValuesRepository.findChildByName(
            'industry_type',
            industryType,
          )
        : null,
      transportType
        ? this.listOfValuesRepository.findChildByName(
            'transport_type',
            transportType,
          )
        : null,
    ]);

    return {
      executor,
      countryFound,
      userTypeFound,
      documentTypeFound,
      industryTypeFound,
      transportTypeFound,
    };
  }
}
