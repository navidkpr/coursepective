import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import AppConfig from './config/app_config';
import { CoursesModule } from './courses/courses.module';
import { Course } from './courses/entities/course.entity';
import { Review } from './reviews/entities/review.entity';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    CoursesModule,
    TypeOrmModule.forRoot({
        type: 'postgres',
        host: AppConfig.Database.Host,
        port: AppConfig.Database.Port,
        username: AppConfig.Database.User,
        password: AppConfig.Database.Password,
        database: AppConfig.Database.DB,
        ssl: AppConfig.Database.SSL,
        entities: [Course, Review],
        synchronize: true,
      }),
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
