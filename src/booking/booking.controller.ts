import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { ClientAuthGuard } from '../auth/guards/client-auth.guard';
import { BookingService } from './booking.service';

@Controller('booking')
@UseGuards(ClientAuthGuard)
@ApiBearerAuth('JWT')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('')
  async createBooking() {
    return 'Add booking';
  }
}
