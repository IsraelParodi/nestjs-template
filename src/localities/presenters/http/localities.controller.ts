import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  OnModuleInit,
  NotFoundException,
} from '@nestjs/common';
import { PaginationQueryDto } from '@common/presenters/dto/pagination-query.dto.ts';
import { Auth } from '@iam/infrastructure/decorators/auth.decorator';
import { AuthType } from '@iam/infrastructure/enum/auth-type.enum';
import { Country } from '@localities/domain/entities/country';
import { ListCountriesUseCase } from '@localities/application/ports/inbound/list-countries.use-case';
import { ListStatesByCountryUseCase } from '@localities/application/ports/inbound/list-states-by-country.use-case';
import { GetStateUseCase } from '@localities/application/ports/inbound/get-state.use-case';
import { GetCountryUseCase } from '@localities/application/ports/inbound/get-country.use-case';

@Auth(AuthType.None)
@Controller('localities')
export class LocalitiesController implements OnModuleInit {
  private countries: Country[];

  constructor(
    private readonly getCountryUseCase: GetCountryUseCase,
    private readonly listCountriesUseCase: ListCountriesUseCase,
    private readonly getStateUseCase: GetStateUseCase,
    private readonly listStatesByCountryUseCase: ListStatesByCountryUseCase,
  ) {}

  async onModuleInit() {
    const countries = await this.listCountriesUseCase.execute({
      page: 1,
      limit: null,
    });

    this.countries = countries.data;
  }

  @Get('countries')
  findAllCountries(@Query() { page = 1, limit = 10 }: PaginationQueryDto) {
    if (this.countries.length) {
      return {
        data: this.countries.slice(page, page + limit),
        total: this.countries.length,
        totalPages: Math.ceil(this.countries.length / limit),
      };
    }

    return this.listCountriesUseCase.execute({ page, limit });
  }

  @Get('countries/:id')
  findOneCountry(@Param('id', ParseIntPipe) id: number) {
    if (this.countries.length) {
      const country = this.countries.find((country) => country.id === id);
      if (!country) {
        throw new NotFoundException(`Country with ID ${id} not found`);
      }

      return country;
    }

    return this.getCountryUseCase.execute(id);
  }

  @Get('countries/:countryId/states')
  findStatesByCountry(
    @Query() { page = 1, limit = null }: PaginationQueryDto,
    @Param('countryId', ParseIntPipe) countryId: number,
  ) {
    return this.listStatesByCountryUseCase.execute(countryId, { page, limit });
  }

  @Get('countries/:countryId/states/:stateId')
  findStatesById(
    @Param('countryId', ParseIntPipe) countryId: number,
    @Param('stateId', ParseIntPipe) stateId: number,
  ) {
    return this.getStateUseCase.execute(countryId, stateId);
  }

  resetCountries() {
    this.countries = [];
  }
}
