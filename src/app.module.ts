import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommandModule } from 'nestjs-command';

import { EventsModule } from './events/events.module';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommandModule,
    AuthModule,
    UsersModule,
    EventsModule,
    ClientsModule,
    BookingModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
