import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { FriendRequest } from './entities/friend_request.entity';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequest]), UsersModule],
  providers: [FriendsService],
  controllers: [FriendsController]
})
export class FriendsModule {}
