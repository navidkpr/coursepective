import { File } from "src/files/entities/file.entity"
import { FriendRequest } from "src/friends/entities/friend_request.entity"
import { Review } from "src/reviews/entities/review.entity"
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[]

    @OneToMany(() => File, (file) => file.user)
    files: File[]

    @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.origin)
    outgoingFriendRequests: FriendRequest[]

    @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.dest)
    incomingFriendRequests: FriendRequest[]

    @ManyToMany(() => Review, (review) => review.usefulVoters)
    usefulReviews: Review[]

    @ManyToMany(() => User, (friend) => friend.friends, { onUpdate: "CASCADE" })
    @JoinTable({ joinColumn: { name: 'users_id_1' } })
    friends: User[]

    @Column()
    email: string
}
