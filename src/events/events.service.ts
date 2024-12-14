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
    paginationDto?: PaginationDto,
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
    return await this.prisma.event.create({
      data: { ...data, createdBy: userId },
    });
  }

  async updateEvent(
    id: string,
    data: CreateEventDto,
    userId: number,
    userRole: UserType,
  ) {
    const event = await this.prisma.event.findUniqueOrThrow({
      where: {
        id: +id,
      },
    });

    if (userRole !== UserType.ADMIN && event.createdBy !== userId) {
      throw new BadRequestException(
        'You do not have permission to edit this event.',
      );
    }

    return await this.prisma.event.update({
      where: {
        id: +id,
        ...(userRole == UserType.ADMIN ? {} : { createdBy: userId }),
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
