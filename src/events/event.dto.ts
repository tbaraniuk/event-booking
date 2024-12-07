import { ApiProperty } from '@nestjs/swagger';
import { EventType } from '@prisma/client';

export class CreateEventDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  max_capacity: number;

  @ApiProperty()
  type: EventType;

  @ApiProperty()
  price?: number;
}

export class EventDto extends CreateEventDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;
}
