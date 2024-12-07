import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  role?: UserType;
}

export class UserDto extends CreateUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;
}
