import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {

  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async createOrUpdate(createCourseDto: CreateCourseDto) {
    let course = await this.courseRepository.findOneBy({ courseCode: createCourseDto.courseCode })
    if (!course) {
      course = new Course()
    }
    
    course.courseCode = createCourseDto.courseCode
    course.name = createCourseDto.courseName
    course.description = createCourseDto.courseDescription
    
    await this.courseRepository.save(course)
    return course
  }

  findAll() {
    return `This action returns all courses`;
  }

  findOne(id: string) {
    return this.courseRepository.findOneByOrFail({ id })
  }

  findOneByCourseCode(courseCode: string) {
    return this.courseRepository.findOneByOrFail({ courseCode })
  }

  update(id: string, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: string) {
    return `This action removes a #${id} course`;
  }
}
