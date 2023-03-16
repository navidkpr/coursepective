import { File } from "src/files/entities/file.entity"
import { Review } from "src/reviews/entities/review.entity"
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Course {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column({ unique: true })
    courseCode: string

    @Column({ default: "" })
    description: string

    @OneToMany(() => Review, (review) => review.course)
    reviews: Review[]

    @OneToMany(() => File, (file) => file.course)
    files: File[]

}
