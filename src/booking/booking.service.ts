import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBookingDto } from './booking.dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async createBooking(createBookingDto: CreateBookingDto) {
    return await this.prisma.booking.create({
      data: createBookingDto,
    });
  }
}
