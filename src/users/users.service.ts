import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './user.dto';
import { PaginationDto } from 'src/common/common.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private readonly saltOrRounds = 10;

  async findOne(username: string) {
    return await this.prisma.user.findFirst({
      where: { username },
    });
  }

  async getProfile(userId: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async getAllUsers(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    return await this.prisma.user.findMany({
      skip: (+page - 1) * +limit,
      take: +limit,
    });
  }

  async createUser(userData: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      userData.password,
      this.saltOrRounds,
    );

    userData.password = hashedPassword;

    await this.prisma.user.create({ data: userData });
  }

  async deleteUser(id: string) {
    await this.prisma.user.delete({ where: { id: +id } });
  }
}
