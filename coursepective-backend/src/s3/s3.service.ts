import { Injectable } from '@nestjs/common';
import * as AWS from "aws-sdk";
import AppConfig from 'src/config/app_config';

@Injectable()
export class S3Service {
    AWS_S3_BUCKET = AppConfig.AWS.S3BucketName
    s3 = new AWS.S3({
        accessKeyId: AppConfig.AWS.AccessKey,
        secretAccessKey: AppConfig.AWS.SecretAccessKey,
    });


    private async s3Upload(file, bucket, name, mimetype) {
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

        try {
            let s3Response = await this.s3.upload(params).promise();

            console.log(s3Response);
            return {
                url: s3Response.Location
            }
        } catch (e) {
            console.log(e);
        }
    }

    public async uploadFile(file, filename: string) {
        return this.s3Upload(file.buffer, this.AWS_S3_BUCKET, filename, file.mimetype);
    }
}
