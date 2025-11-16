import { Test, TestingModule } from '@nestjs/testing';
import { PageableService } from './pageable.service';

describe('PageableService', () => {
  let service: PageableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PageableService],
    }).compile();

    service = module.get<PageableService>(PageableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
