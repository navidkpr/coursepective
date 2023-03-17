import { Course } from "src/courses/entities/course.entity"
import { User } from "src/users/entities/user.entity"
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    rating: number

    @ManyToOne(() => Course, (course) => course.reviews)
    course: Course

    @ManyToOne(() => User, (user) => user.reviews)
    user: User
 
    @OneToMany(() => User, (user) => user.usefulReviews, {cascade: true})
    usefulVoters: User[]

    @Column()
    timePosted: Date
}
