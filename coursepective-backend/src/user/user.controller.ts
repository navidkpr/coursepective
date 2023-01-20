import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('profile')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get('/course/:id')
  // findByEmail(@Param('id') userId: string) {
  //   return this.userService.findOne(userId)
  // }
}
