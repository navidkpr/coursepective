import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from 'src/users/users.service';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
    constructor(
        private readonly filesService: FilesService,
        private readonly usersService: UsersService
    ) {}

    // @UseGuards(AuthGuard('jwt'))
    // @Post()
    // create(@Body() uploadFileDto: uploadFileDto) {
    //     console.log(createReviewDto)
    //     return this.reviewsService.create(createReviewDto);
    // }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //     return this.filesService.findOne(id);
    // }

    // @UseGuards(AuthGuard('jwt'))
    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    //     return this.reviewsService.update(+id, updateReviewDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.reviewsService.remove(+id);
    // }

    // @UseGuards(AuthGuard('jwt'))
    // @Post()
    // uploadFile(@Body() uploadFileDto: uploadFileDto) {
    //     console.log(uploadFileDto)
    //     return this.filesService.upload(uploadFileDto);
    // }

    // @UseGuards(AuthGuard('jwt'))
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(file);
    }

    @Get('/course/:id/:email')
    async findAllByCourse(@Param('id') courseId: string, email: string) {
        console.log('finding files by course id and email')
        const files = await this.filesService.findAllByCourse(courseId)
        const user = await this.usersService.findOneByEmail(email)
        return {
            files: this.filesService.updateFileEmailsForUser(files, user),
        }
    }
}
