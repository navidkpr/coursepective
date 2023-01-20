import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {

  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  create(createReviewDto: CreateReviewDto) {
    this.reviewRepository.insert({ rating: createReviewDto.rating, course: { id: createReviewDto.courseId }, timePosted: new Date() })
  }

  findAll() {
    return `This action returns all reviews`;
  }

  findOne(id: string) {
    return this.reviewRepository.findOneByOrFail({ id })
  }

  fineAllByCourse(courseCode: string) {
    return this.reviewRepository.find({ where: { course: { courseCode }}, order: { "timePosted": "DESC" }})
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
