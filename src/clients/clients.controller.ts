import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';

import { ClientAuthGuard } from '../auth/guards/client-auth.guard';
import { GetClientDto } from './client.dto';
import { ClientsService } from './clients.service';

@Controller('clients')
@UseGuards(ClientAuthGuard)
@ApiBearerAuth('JWT')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get('profile')
  @ApiOkResponse({
    description: 'Get client object',
    type: GetClientDto,
  })
  async getProfile(@Request() req) {
    const clientId = req.client.sub;
    return await this.clientsService.getClientProfile(clientId);
  }
}
