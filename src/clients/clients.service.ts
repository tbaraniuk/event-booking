import * as bcrypt from 'bcrypt';

import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateClientDto } from '../auth/auth.dto';
import { PrismaService } from '../prisma.service';

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
    });
  }
}
