import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { PrismaService } from '../prisma.service';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventType } from '@prisma/client';

describe('EventsController', () => {
  let controller: EventsController;
  let userAuthGuardMock: UserAuthGuard;
  let prismaServiceMock: PrismaService;

  const serviceMock = {
    getNearestEvents: jest.fn().mockImplementation(() => []),
    cancelEvent: jest.fn().mockImplementation(() => {}),
    createEvent: jest.fn().mockImplementation((eventData, userId) => {
      return {
        id: 1,
        ...eventData,
        createdBy: userId,
      };
    }),
    updateEvent: jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 1,
        name: 'updated event title',
        description: 'updated event description',
        location: 'updated location',
        date: new Date(Date.now() + 40000),
        max_capacity: 30,
        type: EventType.ONLINE,
        price: 200,
        createdBy: 1,
      }),
    ),
    deleteEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [EventsService, PrismaService, UserAuthGuard, JwtService],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaServiceMock)
      .overrideGuard(UserAuthGuard)
      .useValue(userAuthGuardMock)
      .overrideProvider(EventsService)
      .useValue(serviceMock)
      .compile();

    controller = module.get<EventsController>(EventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return events', async () => {
    const result = await controller.getEvents();
    expect(serviceMock.getNearestEvents).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  it('should cancel event', async () => {
    const mockedRequest = { user: { sub: 1, role: 'admin' } };
    await controller.cancelEvent(mockedRequest, '1');
    expect(serviceMock.cancelEvent).toHaveBeenCalledTimes(1);
    expect(serviceMock.cancelEvent).toHaveBeenCalledWith('1', 1, 'admin');
  });

  it('should create an event', async () => {
    const mockedRequest = { user: { sub: 1 } };
    const eventData = {
      name: 'event title',
      description: 'event description',
      location: 'location',
      date: new Date(Date.now() + 40000),
      max_capacity: 20,
      type: EventType.ONLINE,
      price: 100,
    };

    const result = await controller.createEvent(mockedRequest, eventData);

    expect(serviceMock.createEvent).toHaveBeenCalledTimes(1);
    expect(serviceMock.createEvent).toHaveBeenCalledWith(eventData, 1);
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name', eventData.name);
    expect(result).toHaveProperty('price', eventData.price);
  });

  it('should update an event', async () => {
    const mockedRequest = { user: { sub: 1, role: 'admin' } };
    const eventData = {
      name: 'updated event title',
      description: 'updated event description',
      location: 'updated location',
      date: new Date(Date.now() + 40000),
      max_capacity: 30,
      type: EventType.ONLINE,
      price: 200,
    };

    const result = await controller.updateEvent(mockedRequest, '1', eventData);

    expect(serviceMock.updateEvent).toHaveBeenCalledTimes(1);
    expect(serviceMock.updateEvent).toHaveBeenCalledWith(
      '1',
      eventData,
      1,
      'admin',
    );
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name', eventData.name);
    expect(result).toHaveProperty('price', eventData.price);
  });

  it('should delete an event', async () => {
    const mockedRequest = { user: { sub: 1, role: 'admin' } };

    await controller.deleteEvent(mockedRequest, '1');
    expect(serviceMock.deleteEvent).toHaveBeenCalledTimes(1);
    expect(serviceMock.deleteEvent).toHaveBeenCalledWith('1', 1, 'admin');
  });
});
