import { Review } from "src/reviews/entities/review.entity"
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[]

    @Column()
    email: string
}
