import { Injectable } from '@nestjs/common';
import { EventType } from '@prisma/client';

import { PrismaService } from '../prisma.service';
import { CreateEventDto } from './event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async getNearestEvents(location?: string, type?: EventType) {
    return await this.prisma.event.findMany({
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
    });
  }

  async createEvent(data: CreateEventDto) {
    return await this.prisma.event.create({
      data,
    });
  }

  async updateEvent(id: number, data: CreateEventDto) {
    return await this.prisma.event.update({
      where: {
        id: id,
      },
      data: { ...data },
    });
  }

  async deleteEvent(id: number) {
    await this.prisma.event.delete({
      where: {
        id: id,
      },
    });
  }
}
