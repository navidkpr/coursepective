import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

  // @Post()
  // async verifyEmail(@Body() body: { email: string; }) {
  //   return {
  //     user: this.usersService.verifyEmail(body.email)
  //   }
  // }

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

  @Post('/:email/profile_picture')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Param('email') email: string, @UploadedFile() file: Express.Multer.File) {
      console.log("Uploading File\n------", file);
      const user = await this.usersService.findOneByEmail(email);
      this.usersService.uploadProfilePicture(user, file);
  }

  @Get('/:email/profile_picture')
  async getProfilePictureUrl(@Param('email') email: string) {
    const user = await this.usersService.findOneByEmail(email)

    let profilePictureUrl = user.profilePictureUrl
    if (!user.profilePictureUrl || user.profilePictureUrl == "" || !user.profilePictureVerified) {
      profilePictureUrl = "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
    }
    
    return {
      profilePictureUrl
    }
  }
}
