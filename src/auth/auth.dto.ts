import { ApiProperty } from '@nestjs/swagger';
import { GetClientDto } from 'src/clients/client.dto';

export class SignInDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

export class ClientSignInDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class AccessTokenDto {
  @ApiProperty()
  access_token: string;
}

export class CreateClientDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  password: string;
}

export class RegisterClientResponseDto {
  access_token: string;
  data: GetClientDto;
}
