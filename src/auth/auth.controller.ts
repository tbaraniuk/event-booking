import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import {
  AccessTokenDto,
  CreateClientDto,
  RegisterClientResponseDto,
  SignInDto,
} from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/user')
  @ApiOkResponse({
    description: 'Access token',
    type: AccessTokenDto,
  })
  async userSignIn(@Body() signInDto: SignInDto) {
    return await this.authService.userSignIn(
      signInDto.username,
      signInDto.password,
    );
  }

  @Post('login/client')
  @ApiOkResponse()
  async signClientIn() {
    return {};
  }

  @Post('register/client')
  @ApiOkResponse({
    description: 'Access token and client data',
    type: RegisterClientResponseDto,
  })
  async registerClient(@Body() CreateClientDto: CreateClientDto) {
    return await this.authService.registerClient(CreateClientDto);
  }
}
