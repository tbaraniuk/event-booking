import * as bcrypt from 'bcrypt';

import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateClientDto } from '../auth/auth.dto';
import { PrismaService } from '../prisma.service';
import { PaginationDto } from '../common/common.dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  private readonly saltOrRounds = 10;

  async findByEmail(email: string) {
    return await this.prisma.client.findUnique({
      where: {
        email: email,
      },
    });
  }

  async getClients(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const clients = await this.prisma.client.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        password: false,
        booking: true,
        createdAt: true,
      },
      skip: (+page - 1) * +limit,
      take: +limit,
    });

    const totalClients = await this.prisma.client.count({});

    return {
      pagination: {
        total: totalClients,
      },
      data: clients,
    };
  }

  async createClient(createClientDto: CreateClientDto) {
    const { username, email, phone, password } = createClientDto;
    const findExistedClient = await this.findByEmail(email);

    if (findExistedClient) {
      throw new BadRequestException();
    }

    const hashedPassword = await bcrypt.hash(password, this.saltOrRounds);

    return await this.prisma.client.create({
      data: {
        username: username,
        email: email,
        phone: phone,
        password: hashedPassword,
      },
    });
  }

  async getClientProfile(clientId: number) {
    return await this.prisma.client.findUnique({
      where: {
        id: clientId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        password: false,
        booking: {
          include: {
            event: true,
          },
        },
        createdAt: true,
      },
    });
  }
}
