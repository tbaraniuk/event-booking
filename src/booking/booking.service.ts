import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBookingDto } from './booking.dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async createBooking(clientId: number, createBookingDto: CreateBookingDto) {
    const isExist = await this.prisma.booking.findFirst({
      where: {
        client_id: clientId,
        event_id: createBookingDto.event_id,
      },
    });

    if (isExist) {
      throw new UnprocessableEntityException();
    }

    const currentEvent = await this.prisma.event.findFirst({
      where: { id: createBookingDto.event_id },
    });

    if (!currentEvent || currentEvent.capacity <= 0) {
      throw new UnprocessableEntityException();
    }

    const newBooking = await this.prisma.booking.create({
      data: {
        client_id: clientId,
        event_id: createBookingDto.event_id,
      },
    });

    await this.prisma.event.update({
      where: {
        id: createBookingDto.event_id,
      },
      data: {
        capacity: { decrement: 1 },
      },
    });

    return newBooking;
  }
}
