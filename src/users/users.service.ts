import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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

  async getAllUsers() {
    return await this.prisma.user.findMany({});
  }

  async createUser(userData: CreateUserDto) {
    await this.prisma.user.create({ data: userData });
  }

  async deleteUser(id: number) {
    await this.prisma.user.delete({ where: { id } });
  }
}
