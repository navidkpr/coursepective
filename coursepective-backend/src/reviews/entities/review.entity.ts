import { Course } from "src/courses/entities/course.entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    rating: number

    @ManyToOne(() => Course, (course) => course.reviews)
    course: Course

    @Column()
    timePosted: Date
}
