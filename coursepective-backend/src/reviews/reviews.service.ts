import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
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
    this.reviewRepository.insert({ rating: createReviewDto.rating, course: { id: createReviewDto.courseId }, timePosted: new Date(), user: user, comments: createReviewDto.comments })
  }

  findAll() {
    return `This action returns all reviews`;
  }

  findOne(id: string) {
    return this.reviewRepository.findOneByOrFail({ id })
  }

  findOneWithUsefulVotes(rid: string){
    return this.reviewRepository.find({ where: {id: rid}, relations: ['usefulVoters']})
  }

  async findAllByCourse(courseId: string) {
    return this.reviewRepository.find({ where: { course: { id: courseId }}, order: { "timePosted": "DESC" }, relations: ['user','usefulVoters']})
  }

async updateReviewEmailsForUser(reviews: Review[], user: User = null) {

    const anonymous = { "email": "Anonymous" };
    let reviewsWithEmails: any[] = reviews;
    if (!user) {
      reviewsWithEmails.forEach(review => review.user = anonymous)
    } else {
      const friends = await this.usersService.getFriends(user)
      console.log(user)
      console.log(friends)
      console.log(reviewsWithEmails)
      for (let i = 0; i < reviewsWithEmails.length; i++) {
        if (user.id !== reviewsWithEmails[i].user.id && !await this.usersService.areFriends(user, reviewsWithEmails[i].user)) {
          reviewsWithEmails[i].user = anonymous;
        }
      }
    }

    reviewsWithEmails.sort((a:any, b:any): number => {
      if (a.user.id && !b.user.id) {
        return -1
      }
      if (!a.user.id && b.user.id) {
        return 1;
      }
      return 0;
    })

    return reviewsWithEmails
  }

  async updateUsefulness(review: Review, user: User, toggle: boolean){
    if (toggle === true){
      // console.log(JSON.stringify(review))
      review.usefulVoters.push(user)
      await this.reviewRepository.save(review)
    }
    else if (toggle === false){ // TODO: don't know if the partial user is enough to locate user in table to delete
      console.log("Trying to delete")
      console.log(JSON.stringify(review.usefulVoters))
      const indexToDelete = review.usefulVoters.indexOf(user)
      console.log(indexToDelete)
      review.usefulVoters.splice(indexToDelete, 1)
      await this.reviewRepository.save(review)
    }
    
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
