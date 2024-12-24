import { Injectable, BadRequestException } from '@nestjs/common';
import { EventType, UserType } from '@prisma/client';

import { PrismaService } from '../prisma.service';
import { CreateEventDto } from './event.dto';
import { PaginationDto } from '../common/common.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async getNearestEvents(
    location?: string,
    type?: EventType,
    paginationDto: PaginationDto = { page: 1, limit: 10 },
  ) {
    const { page, limit } = paginationDto;

    const events = await this.prisma.event.findMany({
      where: {
        date: {
          gte: new Date(),
        },
        location: {
          contains: location,
          mode: 'insensitive',
        },
        ...(type ? { type: type } : {}),
      },
      orderBy: {
        date: 'asc',
      },
      skip: (+page - 1) * +limit,
      take: +limit,
    });

    const totalEvents = await this.prisma.event.count({
      where: {
        date: {
          gte: new Date(),
        },
        location: {
          contains: location,
          mode: 'insensitive',
        },
        ...(type ? { type: type } : {}),
      },
    });

    return {
      pagination: {
        total: totalEvents,
      },
      data: events,
    };
  }

  async createEvent(data: CreateEventDto, userId: number) {
    if (new Date(data.date).getTime() <= Date.now()) {
      throw new Error('The date should be greater than current');
    }

    return await this.prisma.event.create({
      data: { ...data, capacity: data.max_capacity, createdBy: userId },
    });
  }

  async cancelEvent(id: string, userId: string, userRole: string) {
    const event = await this.prisma.event.findUniqueOrThrow({
      where: {
        id: +id,
      },
    });

    if (userRole !== UserType.ADMIN && event.createdBy !== +userId) {
      throw new BadRequestException(
        'You do not have permission to edit this event.',
      );
    }

    return await this.prisma.event.update({
      where: {
        id: +id,
        ...(userRole == UserType.ADMIN ? {} : { createdBy: +userId }),
      },
      data: {
        canceled: true,
      },
    });
  }

  async updateEvent(
    id: string,
    data: CreateEventDto,
    userId: string,
    userRole: UserType,
  ) {
    const event = await this.prisma.event.findUniqueOrThrow({
      where: {
        id: +id,
      },
    });

    if (userRole !== UserType.ADMIN && event.createdBy !== +userId) {
      throw new BadRequestException(
        'You do not have permission to edit this event.',
      );
    }

    return await this.prisma.event.update({
      where: {
        id: +id,
        ...(userRole == UserType.ADMIN ? {} : { createdBy: +userId }),
      },
      data: { ...data },
    });
  }

  async deleteEvent(id: string, userId: number, userRole: UserType) {
    const event = await this.prisma.event.findUniqueOrThrow({
      where: {
        id: +id,
      },
    });

    if (userRole !== UserType.ADMIN && event.createdBy !== userId) {
      throw new BadRequestException(
        'You do not have permission to delete this event.',
      );
    }

    await this.prisma.event.delete({
      where: {
        id: +id,
        ...(userRole == UserType.ADMIN ? {} : { createdBy: userId }),
      },
    });
  }
}
