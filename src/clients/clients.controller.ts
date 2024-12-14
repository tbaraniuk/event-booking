import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';

import { ClientAuthGuard } from '../auth/guards/client-auth.guard';
import { GetClientDto, GetPaginatedClientsDto } from './client.dto';
import { ClientsService } from './clients.service';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { PaginationDto } from '../common/common.dto';

@Controller('clients')
@ApiBearerAuth('JWT')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get('getAll')
  @UseGuards(UserAuthGuard)
  @ApiOkResponse({
    description: 'Get all clients',
    type: GetPaginatedClientsDto,
  })
  async getClients(
    @Query() paginationDto?: PaginationDto,
  ): Promise<GetPaginatedClientsDto> {
    return await this.clientsService.getClients(paginationDto);
  }

  @Get('profile')
  @UseGuards(ClientAuthGuard)
  @ApiOkResponse({
    description: 'Get client object',
    type: GetClientDto,
  })
  async getProfile(@Request() req) {
    const clientId = req.client.sub;
    return await this.clientsService.getClientProfile(clientId);
  }
}
