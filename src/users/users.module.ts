import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserCommand } from './user.command';
import { UserAuthGuard } from 'src/auth/guards/user-auth.guard';

@Module({
  controllers: [UsersController],
  providers: [UserCommand, UsersService, PrismaService, UserAuthGuard],
  exports: [UsersService],
})
export class UsersModule {}
