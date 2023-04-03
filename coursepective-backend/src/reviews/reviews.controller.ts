import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly usersService: UsersService
  ) {}

  // @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    console.log("posting review")
    console.log(createReviewDto)
    return this.reviewsService.create(createReviewDto);
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Patch()
  update(@Body() updateReviewDto: UpdateReviewDto) {
    console.log("in update review controller")
    return this.reviewsService.update(updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }

  @Get('/course/:id/:email')
  async findAllByCourseByEmail(@Param('id') courseId: string, @Param('email') email: string) {
    console.log('finding reviews by course id and email')
    const reviews = await this.reviewsService.findAllByCourse(courseId)
    const user = await this.usersService.findOneByEmail(email)
    return this.reviewsService.updateReviewEmailsForUser(reviews, user)
  }

  @Get('/course/check/:id/:email')
  async getUserCourseReview(@Param('id') courseId: string, @Param('email') email: string) {
    console.log('checking if review exists')
    const user = await this.usersService.findOneByEmail(email)
    return this.reviewsService.getUserCourseReview(courseId, user)
  }

  @Get('/user/:email')
  async findAllByEmail(@Param('email') email: string) {
    console.log('finding reviews by email')
    const user = await this.usersService.findOneByEmail(email)
    console.log('after finding user')
    return this.reviewsService.findAllByUser(user)
  }

  @Get('/useful/:email')
  async findUsefulByEmail(@Param('email') email: string) {
    console.log('finding useful reviews by email')
    const user = await this.usersService.findOneByEmail(email)
    console.log('after finding user')
    return this.reviewsService.findUsefulByUser(user)
  }

  @Get('/course/:id')
  async findAllByCourse(@Param('id') courseId: string) {
    const reviews = await this.reviewsService.findAllByCourse(courseId)
    return this.reviewsService.updateReviewEmailsForUser(reviews)
  }

  @Put('/:id/:email/toggleUsefulVotes/:action')
  async updateUsefulness(@Param('id') reviewId: string, @Param('email') email: string, @Param('action') toggleAction: string){
    console.log(`Marking usefulness as ${toggleAction}`)
    const review = await this.reviewsService.findOneWithUsefulVotes(reviewId)
    const user = await this.usersService.findOneByEmail(email)
    console.log(`There are this many reviews: ${review.length}`)
    return this.reviewsService.updateUsefulness(review[0], user, toggleAction)

  }
}
