import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthzModule } from './authz/authz.module';
import AppConfig from './config/app_config';
import { CoursesModule } from './courses/courses.module';
import { Course } from './courses/entities/course.entity';
import { FriendRequest } from './friends/entities/friend_request.entity';
import { FriendsModule } from './friends/friends.module';
import { MeilisearchModule } from './meilisearch/meilisearch.module';
import { Review } from './reviews/entities/review.entity';
import { ReviewsModule } from './reviews/reviews.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    CoursesModule,
    MeilisearchModule,
    TypeOrmModule.forRoot({
        type: 'postgres',
        host: AppConfig.Database.Host,
        port: AppConfig.Database.Port,
        username: AppConfig.Database.User,
        password: AppConfig.Database.Password,
        database: AppConfig.Database.DB,
        ssl: AppConfig.Database.SSL,
        entities: [Course, Review, FriendRequest, User],
        synchronize: true,
      }),
    ReviewsModule,
    UsersModule,
    AuthzModule,
    FriendsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
