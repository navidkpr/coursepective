import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {

  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private usersService: UsersService,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    const user = await this.usersService.findOneByEmailOrCreate(createReviewDto.userEmail)
    this.reviewRepository.insert({ rating: createReviewDto.rating, course: { id: createReviewDto.courseId }, timePosted: new Date(), user: user })
  }

  findAll() {
    return `This action returns all reviews`;
  }

  findOne(id: string) {
    return this.reviewRepository.findOneByOrFail({ id })
  }

  findAllByCourse(courseId: string) {
    return this.reviewRepository.find({ where: { course: { id: courseId }}, order: { "timePosted": "DESC" }, relations: ['user']})
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
