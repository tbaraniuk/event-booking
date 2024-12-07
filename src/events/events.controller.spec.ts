import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { PrismaService } from '../prisma.service';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

describe('EventsController', () => {
  let controller: EventsController;
  let userAuthGuardMock: UserAuthGuard;
  let prismaServiceMock: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [EventsService, PrismaService, UserAuthGuard, JwtService],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaServiceMock)
      .overrideGuard(UserAuthGuard)
      .useValue(userAuthGuardMock)
      .compile();

    controller = module.get<EventsController>(EventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
