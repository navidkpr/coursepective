import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { QueryFailedError, Repository } from 'typeorm';
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
    this.reviewRepository.insert({ teachingRating: createReviewDto.teachingRating, labRating: createReviewDto.labRating, testRating: createReviewDto.testRating, course: { id: createReviewDto.courseId }, timePosted: new Date(), user: user, comments: createReviewDto.comments, professor: createReviewDto.professor})
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

  async findAllByUser(user: User = null) {
    console.log("in find all by user")
    return this.reviewRepository.find({ where: { user: { id: user.id}}, order: { "timePosted": "DESC" }, relations: ['course','user','usefulVoters']})
  }

  async findUsefulByUser(user: User = null) {
    console.log("in find useful by user")
    return this.reviewRepository.find({ where: { usefulVoters: { id: user.id}}, order: { "timePosted": "DESC" }, relations: ['course','user','usefulVoters']})
  }

  async getUserCourseReview(courseId: string, user: User = null) {
    console.log("checking if exists")
    return this.reviewRepository.findOne({ where: { course: { id: courseId}, user: { id: user.id}}})
  }

  async updateReviewEmailsForUser(reviews: Review[], user: User = null) {

    const anonymous = { "email": "Anonymous", "profilePictureUrl": "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg" };
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

  async updateUsefulness(review: Review, user: User, toggle: string){
    if (toggle == 'true'){
      console.log("Trying to mark")
      review.usefulVoters.push(user)
      await this.reviewRepository.save(review)
    }
    else{
      console.log("Trying to remove mark")
      console.log(JSON.stringify(review.usefulVoters))
      const indexToDelete = review.usefulVoters.indexOf(user)
      console.log(indexToDelete)
      review.usefulVoters.splice(indexToDelete, 1)
      await this.reviewRepository.save(review)
    }
    
  }

  async update(updateReviewDto: UpdateReviewDto) {
    console.log("in update review service")
    const user = await this.usersService.findOneByEmailOrCreate(updateReviewDto.userEmail)
    const review = await this.getUserCourseReview(updateReviewDto.courseId, user)
    return this.reviewRepository.save( {id: review.id, teachingRating: updateReviewDto.teachingRating, labRating: updateReviewDto.labRating, testRating: updateReviewDto.testRating, course: { id: updateReviewDto.courseId }, timeEdited: new Date(), user: user, comments: updateReviewDto.comments, professor: updateReviewDto.professor })
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
