import { Review } from "src/reviews/entities/review.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FriendRequest {
    constructor(origin, dest) {
        this.origin = origin;
        this.dest = dest;
    }
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => User, (user) => user.outgoingFriendRequests, { eager: true })
    origin: User

    @ManyToOne(() => User, (user) => user.incomingFriendRequests, { eager: true })
    dest: User
}
