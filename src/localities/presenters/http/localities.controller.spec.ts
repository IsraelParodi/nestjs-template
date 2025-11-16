import { Test, TestingModule } from '@nestjs/testing';
import { CountriesApplicationService } from 'src/localities/application/services/countries.service';
import { LocalitiesController } from './localities.controller';

describe('UsersController', () => {
  let controller: LocalitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocalitiesController],
      providers: [CountriesApplicationService],
    }).compile();

    controller = module.get<LocalitiesController>(LocalitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
