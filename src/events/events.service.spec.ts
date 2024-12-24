import { Test, TestingModule } from '@nestjs/testing';
import { EventType } from '@prisma/client';

import { PrismaService } from '../prisma.service';
import { EventsService } from './events.service';

describe('EventsService', () => {
  let service: EventsService;
  let prisma: PrismaService;

  const prismaMock = {
    event: {
      findMany: jest.fn(),
      create: jest
        .fn()
        .mockImplementation((event) =>
          Promise.resolve({ id: Date.now(), ...event }),
        ),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    service = module.get<EventsService>(EventsService);
    prisma = module.get<PrismaService>(PrismaService);

    prismaMock.event.findMany.mockClear();
    prismaMock.event.create.mockClear();
    prismaMock.event.count.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('creating event', () => {
    it('should create event', async () => {
      const data = {
        name: 'event title',
        description: 'event description',
        location: 'location',
        date: new Date(Date.now() + 40000),
        max_capacity: 20,
        type: EventType.ONLINE,
        price: 100,
      };

      const userId = 1;

      await service.createEvent(data, userId);

      expect(prisma.event.create).toHaveBeenCalledWith({
        data: {
          ...data,
          capacity: data.max_capacity,
          createdBy: userId,
        },
      });
    });

    it('should throw an exception if date is earlier than now', async () => {
      const data = {
        name: 'event title',
        description: 'event description',
        location: 'location',
        date: new Date(Date.now() - 10000),
        max_capacity: 20,
        type: EventType.ONLINE,
        price: 100,
      };

      const userId = 1;

      await expect(service.createEvent(data, userId)).rejects.toThrow(
        'The date should be greater than current',
      );
    });
  });

  describe('getting events', () => {
    it('should return events', async () => {
      const responseData = {
        pagination: {},
        data: [],
      };

      prismaMock.event.findMany.mockResolvedValue(responseData);

      await service.getNearestEvents();

      expect(prismaMock.event.findMany).toHaveBeenCalledTimes(1);
    });
  });
});
