import { Test, TestingModule } from '@nestjs/testing';
import { CountriesApplicationService } from './countries.service';

describe('CountriesService', () => {
  let service: CountriesApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CountriesApplicationService],
    }).compile();

    service = module.get<CountriesApplicationService>(CountriesApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
