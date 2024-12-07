import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import * as bcrypt from 'bcrypt';

import { UsersService } from './users.service';
import { UserType } from '@prisma/client';

@Injectable()
export class UserCommand {
  constructor(private readonly userService: UsersService) {}

  private readonly saltOrRounds = 10;

  @Command({
    command: 'create:admin',
    describe: 'create an admin user',
  })
  async createAdmin() {
    const existingAdmin = await this.userService.findOne('admin');

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD,
        this.saltOrRounds,
      );

      const adminUser = {
        username: 'admin',
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: UserType.ADMIN,
      };

      await this.userService.createUser(adminUser);
      console.log('Admin user successfully created!');
    } else {
      console.log('Admin user already exists!');
    }
  }
}
