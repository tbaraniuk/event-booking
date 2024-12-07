import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { EventType } from '@prisma/client';

import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { CreateEventDto, EventDto } from './event.dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('/')
  @ApiOkResponse({
    description: 'Array of event objects',
    type: [EventDto],
  })
  @ApiQuery({
    name: 'location',
    required: false,
    type: String,
    description: 'Filter by location',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: EventType,
    description: 'Filter by event type',
  })
  async getEvents(
    @Query('location') location?: string,
    @Query('type') type?: EventType,
  ): Promise<EventDto[]> {
    return await this.eventsService.getNearestEvents(location, type);
  }

  @Post('/')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth('JWT')
  async createEvent(
    @Body()
    eventData: CreateEventDto,
  ) {
    await this.eventsService.createEvent({
      ...eventData,
    });
  }

  @Put('/:id')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  async updateEvent(@Param() id: number, @Body() data: CreateEventDto) {
    await this.eventsService.updateEvent(id, data);
  }

  @Delete('/:id')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  async deleteEvent(@Param() id: number) {
    await this.eventsService.deleteEvent(id);
  }
}
