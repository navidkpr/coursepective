import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/courses/entities/course.entity';
import { S3Service } from 'src/s3/s3.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';

@Injectable()
export class FilesService {

    constructor(
        @InjectRepository(File)
        private filesRepository: Repository<File>,
        private usersService: UsersService,
        private s3Service: S3Service,
    ) {}

    

    public async uploadCourseFileByUser(file, filename: string, course: Course, user: User) {
        console.log(file, course, user);
        const uploadResponse = await this.s3Service.uploadFile(file, filename); 
        this.filesRepository.insert({ 
            course: { id: course.id }, 
            timePosted: new Date(), 
            user: user,
            location: uploadResponse.url,
            name: filename,
            isVerified: true
        })
        return uploadResponse;
    }

    async findAllVerifiedByCourse(courseId: string) {
        return this.filesRepository.find({ where: { course: { id: courseId }, isVerified: true }, order: { "timePosted": "DESC" }, relations: ['user']})
    }

    async updateFileEmailsForUser(files: File[], user: User) {
        const anonymous = { "email": "Anonymous" };
        let filesWithEmails: any[] = files;
        if (!user) {
            filesWithEmails.forEach(review => review.user = anonymous)
        } else {
            for (let i = 0; i < filesWithEmails.length; i++) {
                if (user.id !== filesWithEmails[i].user.id && !await this.usersService.areFriends(user, filesWithEmails[i].user)) {
                filesWithEmails[i].user = anonymous;
                }
            }
        }

        filesWithEmails.sort((a:any, b:any): number => {
        if (a.user.id && !b.user.id) {
            return -1
        }
        if (!a.user.id && b.user.id) {
            return 1;
        }
        return 0;
        })

        return filesWithEmails
    }
}

