import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  OnModuleInit,
  NotFoundException,
} from '@nestjs/common';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto.ts';
import { CountriesApplicationService } from '@localities/application/services/countries.service';
import { Auth } from '@iam/infrastructure/decorators/auth.decorator';
import { AuthType } from '@iam/infrastructure/enum/auth-type.enum';
import { StatesApplicationService } from '@localities/application/services/states.service';
import { Country } from '@localities/domain/country';

@Auth(AuthType.None)
@Controller('localities')
export class LocalitiesController implements OnModuleInit {
  private countries: Country[];

  constructor(
    private readonly countriesApplicationService: CountriesApplicationService,
    private readonly statesApplicationService: StatesApplicationService,
  ) {}

  async onModuleInit() {
    const countries = await this.countriesApplicationService.findAll({
      start: 0,
      limit: null,
    });

    this.countries = countries.data;
  }

  @Get('countries')
  findAllCountries(@Query() { start = 0, limit = 10 }: PaginationQueryDto) {
    if (this.countries.length) {
      return {
        data: this.countries.slice(start, start + limit),
        total: this.countries.length,
        totalPages: Math.ceil(this.countries.length / limit),
      };
    }

    return this.countriesApplicationService.findAll({ start, limit });
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

    return this.countriesApplicationService.findOne({ where: { id } });
  }

  @Get('countries/:countryId/states')
  findStatesByCountry(
    @Query() { start = 0, limit = null }: PaginationQueryDto,
    @Param('countryId', ParseIntPipe) countryId: number,
  ) {
    return this.statesApplicationService.findAll(
      { start, limit },
      { where: { countryId } },
    );
  }

  @Get('countries/:countryId/states/:stateId')
  findStatesById(
    @Param('countryId', ParseIntPipe) countryId: number,
    @Param('stateId', ParseIntPipe) id: number,
  ) {
    return this.statesApplicationService.findOne({
      where: { countryId, id },
    });
  }

  resetCountries() {
    this.countries = [];
  }
}
