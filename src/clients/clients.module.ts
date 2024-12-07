import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { PrismaService } from 'src/prisma.service';
import { ClientAuthGuard } from 'src/auth/guards/client-auth.guard';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService, PrismaService, ClientAuthGuard],
  exports: [ClientsService],
})
export class ClientsModule {}
