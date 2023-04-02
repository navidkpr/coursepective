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
  @Get('/user/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email)
  }

  @Get('/friends/:email')
  async findFriends(@Param('email') email: string){
    const user = await this.usersService.findOneByEmail(email)
    return this.usersService.getFriends(user)
  }

  
  @Get('/friends/:user/:friend')
  async checkIfFriends(@Param('user') email1: string, @Param('friend') email2: string){
    const user1 = await this.usersService.findOneByEmail(email1)
    const user2 = await this.usersService.findOneByEmail(email2)
    return this.usersService.areFriends(user1, user2)
  }
}
