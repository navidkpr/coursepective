import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeilisearchModule } from 'src/meilisearch/meilisearch.module';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course]), MeilisearchModule],
  controllers: [CoursesController],
  providers: [CoursesService]
})
export class CoursesModule {}
