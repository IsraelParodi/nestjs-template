import { Test, TestingModule } from '@nestjs/testing';
import { QuotationsApplicationService } from './quotations.service';

describe('UsersService', () => {
  let service: QuotationsApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuotationsApplicationService],
    }).compile();

    service = module.get<QuotationsApplicationService>(QuotationsApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
