import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { ClientAuthGuard } from '../auth/guards/client-auth.guard';
import { PrismaService } from '../prisma.service';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

describe('BookingController', () => {
  let controller: BookingController;
  let prismaServiceMock: PrismaService;
  let clientAuthGuardMock: ClientAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [BookingService, ClientAuthGuard, JwtService, PrismaService],
    })
      .overridePipe(PrismaService)
      .useValue(prismaServiceMock)
      .overrideGuard(clientAuthGuardMock)
      .useValue(clientAuthGuardMock)
      .compile();

    controller = module.get<BookingController>(BookingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
