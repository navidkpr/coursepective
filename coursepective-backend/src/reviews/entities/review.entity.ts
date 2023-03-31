import { Course } from "src/courses/entities/course.entity"
import { User } from "src/users/entities/user.entity"
import { Column, Entity, ManyToOne, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique } from "typeorm"

@Entity()
@Unique(["course", "user"])
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    rating: number

    @Column({ default: "" })
    comments: string

    @ManyToOne(() => Course, (course) => course.reviews)
    course: Course

    @ManyToOne(() => User, (user) => user.reviews)
    user: User
 
    @ManyToMany(() => User, (user) => user.usefulReviews, {cascade: true})
    @JoinTable()
    usefulVoters: User[]

    @Column()
    timePosted: Date
}
