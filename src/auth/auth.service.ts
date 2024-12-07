import * as bcrypt from 'bcrypt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ClientsService } from '../clients/clients.service';
import { UsersService } from '../users/users.service';
import { CreateClientDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private clientsService: ClientsService,
    private jwtService: JwtService,
  ) {}

  async userSignIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);

    const isPasswordMatch = await bcrypt.compare(pass, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.username, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async registerClient(createClientDto: CreateClientDto) {
    const newClient = await this.clientsService.createClient(createClientDto);

    const payload = {
      sub: newClient.id,
      username: newClient.username,
      email: newClient.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      data: newClient,
    };
  }
}
