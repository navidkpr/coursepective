import { Course } from "src/courses/entities/course.entity"
import { User } from "src/users/entities/user.entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class File {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    location: string

    @ManyToOne(() => Course, (course) => course.files)
    course: Course

    @ManyToOne(() => User, (user) => user.files)
    user: User

    @Column({ default: false })
    isVerified: boolean

    @Column()
    name: string

    @Column()
    timePosted: Date
}
