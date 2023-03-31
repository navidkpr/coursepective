import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async register(@Body() body: { email: string; }) {
    return {
      user: this.usersService.create(body.email)
    }
  }
  @Get(':email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email)
  }

  @Get('/friends/:email')
  async findFriends(@Param('email') email: string){
    const user = await this.usersService.findOneByEmail(email)
    return this.usersService.getFriends(user)
  }
}
