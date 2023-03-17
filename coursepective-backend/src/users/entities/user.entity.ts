import { FriendRequest } from "src/friends/entities/friend_request.entity"
import { Review } from "src/reviews/entities/review.entity"
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[]

    @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.origin)
    outgoingFriendRequests: FriendRequest[]

    @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.dest)
    incomingFriendRequests: FriendRequest[]

    @ManyToOne(() => Review, (review) => review.usefulVoters)
    usefulReviews: User

    @ManyToMany(() => User, (friend) => friend.friends, { onUpdate: "CASCADE" })
    @JoinTable({ joinColumn: { name: 'users_id_1' } })
    friends: User[]

    @Column()
    email: string
}
