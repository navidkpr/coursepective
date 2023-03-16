import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as AWS from "aws-sdk";
import AppConfig from 'src/config/app_config';
import { Course } from 'src/courses/entities/course.entity';
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
    ) {}

    AWS_S3_BUCKET = AppConfig.AWS.S3BucketName
    s3 = new AWS.S3({
        accessKeyId: AppConfig.AWS.AccessKey,
        secretAccessKey: AppConfig.AWS.SecretAccessKey,
    });


    private async s3Upload(file, bucket, name, mimetype)
    {
        const params = 
        {
            Bucket: bucket,
            Key: String(name),
            Body: file,
            ACL: "public-read",
            ContentType: mimetype,
            ContentDisposition:"inline",
            CreateBucketConfiguration: 
            {
                LocationConstraint: "ap-south-1"
            }
        };

        console.log(params);

        try
        {
            let s3Response = await this.s3.upload(params).promise();

            console.log(s3Response);
        }
        catch (e)
        {
            console.log(e);
        }
    }

    private async uploadFile(file)
    {
        const { originalname } = file;

        await this.s3Upload(file.buffer, this.AWS_S3_BUCKET, originalname, file.mimetype);
    }

    public async uploadCourseFileByUser(file, course: Course, user: User) {
        // this.uploadFile()
    }

    async findAllByCourse(courseId: string) {
        return this.filesRepository.find({ where: { course: { id: courseId }}, order: { "timePosted": "DESC" }, relations: ['user']})
    }

    async updateFileEmailsForUser(files: File[], user: User = null) {
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

