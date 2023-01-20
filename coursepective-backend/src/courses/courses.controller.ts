import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { IndexType, MeilisearchService } from 'src/meilisearch/meilisearch.service';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly meilisearchService: MeilisearchService,
  ) {}

  @Post()
  async createOrUpdate(@Body() createCourseDto: CreateCourseDto) {
    createCourseDto.courseCode = createCourseDto.courseCode.toLowerCase()
    createCourseDto.courseName = createCourseDto.courseName.toLowerCase()
    createCourseDto.courseDescription = createCourseDto.courseDescription.toLowerCase()
    
    const course = await this.coursesService.createOrUpdate(createCourseDto);
    await this.meilisearchService.addCourseToIndex({
      courseCode: createCourseDto.courseCode, 
      courseName: createCourseDto.courseName,
      courseDescription: createCourseDto.courseDescription,
    })
    return course
  }

  @Post('initialize')
  async initialize() {
    return this.meilisearchService.createIndex({ indexType: IndexType.Courses })
  }

  @Post('search')
  async search(@Body() body: { searchString: string }) {
    const { searchString } = body;
    return this.meilisearchService.searchForCourse(searchString, 8)
  }

  // @Get()
  // findAll() {
  //   return this.coursesService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
  //   return this.coursesService.update(+id, updateCourseDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.coursesService.remove(+id);
  // }
}
