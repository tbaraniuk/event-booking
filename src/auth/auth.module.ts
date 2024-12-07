import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule } from 'src/clients/clients.module';
import { UserAuthGuard } from './guards/user-auth.guard';
import { ClientAuthGuard } from './guards/client-auth.guard';

@Module({
  imports: [
    UsersModule,
    ClientsModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserAuthGuard, ClientAuthGuard],
})
export class AuthModule {}
