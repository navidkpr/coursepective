import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('profile')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get('/course/:id')
  // findByEmail(@Param('id') userId: string) {
  //   return this.userService.findOne(userId)
  // }
}
