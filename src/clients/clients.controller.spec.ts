import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { ClientAuthGuard } from '../auth/guards/client-auth.guard';
import { PrismaService } from '../prisma.service';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';

describe('ClientsController', () => {
  let controller: ClientsController;
  let clientsServiceMock: ClientsService;
  let prismaServiceMock: PrismaService;
  let clientAuthGuardMock: ClientAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [ClientsService, PrismaService, ClientAuthGuard, JwtService],
    })
      .overrideProvider(ClientsService)
      .useValue(clientsServiceMock)
      .overrideProvider(PrismaService)
      .useValue(prismaServiceMock)
      .overrideGuard(ClientAuthGuard)
      .useValue(clientAuthGuardMock)
      .compile();

    controller = module.get<ClientsController>(ClientsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
