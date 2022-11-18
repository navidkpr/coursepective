import { Review } from "src/reviews/entities/review.entity"
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Course {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string
    
    @Column()
    courseCode: string

    @Column({ default: "" })
    description: string

    @OneToMany(() => Review, (review) => review.course)
    reviews: Review[]
}
