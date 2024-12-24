import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
  Get,
  Request,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { UsersService } from './users.service';
import { Admin } from '../auth/roles.decorator';
import { CreateUserDto, UserDto } from './user.dto';
import { PaginationDto } from '../common/common.dto';

@Controller('users')
@UseGuards(UserAuthGuard)
@ApiBearerAuth('JWT')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  @Admin()
  @ApiOkResponse({ description: 'Array of user objects', type: [UserDto] })
  async getUsers(@Query() paginationDto?: PaginationDto): Promise<UserDto[]> {
    return await this.usersService.getAllUsers(paginationDto);
  }

  @Get('profile')
  @ApiOkResponse({ description: 'User object', type: UserDto })
  async getProfile(@Request() req): Promise<UserDto> {
    const userId = req.user.sub;
    return await this.usersService.getProfile(userId);
  }

  @Post('')
  @Admin()
  async createUser(@Body() userData: CreateUserDto) {
    await this.usersService.createUser(userData);
  }

  @Delete('/:id')
  @Admin()
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  async deleteUser(@Param('id') id: string) {
    console.log('id1', id);

    await this.usersService.deleteUser(id);
  }
}
