import { Test, TestingModule } from '@nestjs/testing';
import { QuotationsDomainService } from './quotations.service';

describe('UsersService', () => {
  let service: QuotationsDomainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuotationsDomainService],
    }).compile();

    service = module.get<QuotationsDomainService>(QuotationsDomainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
