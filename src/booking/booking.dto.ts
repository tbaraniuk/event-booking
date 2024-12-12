import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty()
  event_id: number;

  @ApiProperty()
  client_id: number;
}
