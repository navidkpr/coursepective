import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { CoursesService } from 'src/courses/courses.service';
import { UsersService } from 'src/users/users.service';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
    constructor(
        private readonly filesService: FilesService,
        private readonly usersService: UsersService,
        private readonly courseService: CoursesService,
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
    @Post('/course/:id/:email/upload/:filename')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@Param('id') courseId: string, @Param('email') email: string, @Param('filename') filename: string, @UploadedFile() file: Express.Multer.File) {
        console.log("Uploading File\n------", file);
        const user = await this.usersService.findOneByEmail(email);
        const course = await this.courseService.findOne(courseId);
        return this.filesService.uploadCourseFileByUser(file, filename, course, user);
    }

    @Get('/course/:id/:email')
    async findAllByCourseAndEmail(@Param('id') courseId: string, @Param('email') email: string) {
        console.log('finding files by course id and email')
        const files = await this.filesService.findAllVerifiedByCourse(courseId)
        const user = await this.usersService.findOneByEmail(email)
        const filesWithUsers = await this.filesService.updateFileEmailsForUser(files, user)
        console.log(filesWithUsers)
        return {
            files: filesWithUsers
        }
    }

    @Get('/course/:id')
    async findAllByCourse(@Param('id') courseId: string) {
        const reviews = await this.filesService.findAllVerifiedByCourse(courseId)
        return {
            files: this.filesService.updateFileEmailsForUser(reviews, null)
        }
    }
}
