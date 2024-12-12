import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBookingDto } from './booking.dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async createBooking(createBookingDto: CreateBookingDto) {
    const isExist = await this.prisma.booking.findFirst({
      where: {
        client_id: createBookingDto.client_id,
        event_id: createBookingDto.client_id,
      },
    });

    if (isExist) {
      throw new UnprocessableEntityException();
    }

    const newBooking = await this.prisma.booking.create({
      data: createBookingDto,
    });

    return newBooking;
  }
}
