import { Controller, Post, UseGuards, Body, Request } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { ClientAuthGuard } from '../auth/guards/client-auth.guard';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './booking.dto';

@Controller('booking')
@UseGuards(ClientAuthGuard)
@ApiBearerAuth('JWT')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('')
  async createBooking(
    @Request() req,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    const clientId = req.client.sub;

    return await this.bookingService.createBooking(clientId, createBookingDto);
  }
}
