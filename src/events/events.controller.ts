import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
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
import { CreateEventDto, GetPaginatedEventsDto } from './event.dto';
import { EventsService } from './events.service';
import { PaginationDto } from '../common/common.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('/')
  @ApiOkResponse({
    description: 'Array of event objects',
    type: GetPaginatedEventsDto,
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
    @Query() paginationDto?: PaginationDto,
  ): Promise<GetPaginatedEventsDto> {
    return await this.eventsService.getNearestEvents(
      location,
      type,
      paginationDto,
    );
  }

  @Post('/')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth('JWT')
  async createEvent(
    @Request() req,
    @Body()
    eventData: CreateEventDto,
  ) {
    const userId = req.user.sub;

    await this.eventsService.createEvent(
      {
        ...eventData,
      },
      userId,
    );
  }

  @Put('/:id')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  async updateEvent(
    @Request() req,
    @Param('id') id: string,
    @Body() data: CreateEventDto,
  ) {
    const userId = req.user.sub;
    const userRole = req.user.role;
    return await this.eventsService.updateEvent(id, data, userId, userRole);
  }

  @Delete('/:id')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  async deleteEvent(@Request() req, @Param('id') id: string) {
    const userId = req.user.sub;
    const userRole = req.user.role;
    await this.eventsService.deleteEvent(id, userId, userRole);
  }
}
