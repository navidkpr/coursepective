import { Body, ConflictException, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { FriendRequest } from './entities/friend_request.entity';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
    constructor(
        private readonly friendsService: FriendsService,
        private readonly usersService: UsersService,    
    ) {}

    @Post('/requests')
    async sendFriendRequest(@Body() body: { originEmail: string; destEmail: string }) {
        const { originEmail, destEmail } = body;
        const originUser: User = await this.usersService.findOneByEmail(originEmail);
        const destUser: User = await this.usersService.findOneByEmail(destEmail);
        if (await this.usersService.areFriends(originUser, destUser)) {
            throw new ConflictException("You are already friends with this user")
        }
        return this.friendsService.createFriendRequest(originUser, destUser);
    }

    @Get('/requests')
    async listIncomingFriendRequests(@Body() body: { userEmail: string }) {
        const { userEmail } = body;
        const user: User = await this.usersService.findOneByEmail(userEmail, ["incomingFriendRequests"]);

        const friendRequests: FriendRequest[] = await this.friendsService.listUserIncomingFriendRequests(user)
        return {
            friendRequests
        };
    }

    @Post('/get')
    async getFriends(@Body() body: { userEmail: string }) {
        const { userEmail } = body;
        const user: User = await this.usersService.findOneByEmail(userEmail, ["incomingFriendRequests"]);

        const friends: User[] = await this.friendsService.getFriends(user)
        return {
            friends
        };
    }

    @Post('/requests/response')
    async respondToFriendRequest(@Body() body: { accept: boolean; userEmail: string; friendRequestId: string; }) {
        const { accept, userEmail, friendRequestId } = body
        const user: User = await this.usersService.findOneByEmail(userEmail);

        const friendRequest: FriendRequest = await this.friendsService.findFriendRequestByDestAndId(user, friendRequestId)

        if (friendRequest) {
            if (accept) {
                this.friendsService.acceptFriendRequest(friendRequest)
            } else {
                this.friendsService.rejectFriendRequest(friendRequest)
            }
            this.friendsService.deleteFriendRequest(friendRequest)
        }
    }
}
