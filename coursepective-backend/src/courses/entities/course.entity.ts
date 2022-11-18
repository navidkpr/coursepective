import { Column, PrimaryGeneratedColumn } from "typeorm"

export class Course {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string
    
    @Column()
    courseCode: string
}
