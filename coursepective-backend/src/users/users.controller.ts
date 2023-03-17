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
  // @Get('/course/:id')
  // findByEmail(@Param('id') userId: string) {
  //   return this.userService.findOne(userId)
  // }
}
