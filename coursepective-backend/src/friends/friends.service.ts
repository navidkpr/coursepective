import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { FriendRequest } from './entities/friend_request.entity';

@Injectable()
export class FriendsService {

    constructor(
        @InjectRepository(FriendRequest)
        private friendRequestRepository: Repository<FriendRequest>,
        private readonly userService: UsersService,
    ) {}

    // Add friend from email?
    // User search???
    async createFriendRequest(origin: User, dest: User): Promise<FriendRequest> {
        let friendRequest = await this.friendRequestRepository.findOneBy({ origin, dest })

        if (!friendRequest) {
            friendRequest = new FriendRequest(origin, dest)
            await this.friendRequestRepository.save(friendRequest);
        }

        return friendRequest
    }

    async findFriendRequestByDestAndId(dest: User, id: string) {
        return this.friendRequestRepository.findOneBy({ dest: dest, id: id })
    }

    async deleteFriendRequest(friendRequest: FriendRequest) {
        console.log('deleting friend request')
        await this.friendRequestRepository.delete(friendRequest)
    }

    // Accept friend request id => I Will have to find
    async acceptFriendRequest(friendRequest: FriendRequest) {
        console.log(friendRequest)
        await this.userService.addFriend(friendRequest.origin, friendRequest.dest)
    }

    async getFriends(user: User) {
        return this.userService.getFriends(user);
    }

    async rejectFriendRequest(friendRequest: FriendRequest) {
        await this.friendRequestRepository.delete(friendRequest)
    }

    async listUserIncomingFriendRequests(user: User): Promise<FriendRequest[]> {
        return user.incomingFriendRequests? user.incomingFriendRequests : []
    }

    async listUserOutgoingFriendRequests(user: User): Promise<FriendRequest[]> {
        return user.outgoingFriendRequests? user.outgoingFriendRequests : []
    }
}
