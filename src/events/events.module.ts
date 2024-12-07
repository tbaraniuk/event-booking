import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaService } from 'src/prisma.service';
import { UserAuthGuard } from 'src/auth/guards/user-auth.guard';

@Module({
  controllers: [EventsController],
  providers: [EventsService, PrismaService, UserAuthGuard],
})
export class EventsModule {}
