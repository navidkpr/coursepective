import { Injectable } from '@nestjs/common';
import { Document, Index, MeiliSearch } from 'meilisearch';
import AppConfig from 'src/config/app_config';
import BaseDocument from './types/documents/BaseDocument';
import CourseDocument from './types/documents/CourseDocument';

export enum IndexType {
  Courses = 'courses',
}

export interface IndexInformation {
  indexType: IndexType
}

@Injectable()
export class MeilisearchService {
  private client: MeiliSearch;

  constructor() {
    this.client = new MeiliSearch({
      host: AppConfig.Meilisearch.Url,
      apiKey: AppConfig.Meilisearch.ApiKey
    });
  }

  private getIndexName(indexInfo: IndexInformation) {
    return `${indexInfo.indexType}`;
  }

  private getIndex(indexInfo: IndexInformation): Promise<Index> {
    return this.client.getIndex(this.getIndexName(indexInfo))
  }

  public async createIndex(indexInfo: IndexInformation): Promise<Index> {
    const indexName = this.getIndexName(indexInfo);
    await this.client.createIndex(indexName, { primaryKey: 'courseCode' });
    const index = await this.getIndex(indexInfo);
    await index.updateFilterableAttributes(['courseCode', 'courseName']);
    return index;
  }

  private async getCoursesIndex() {
    return this.getIndex({ indexType: IndexType.Courses })
  }

  public async addCourseToIndex(courseDocument: CourseDocument) {
    const index = await this.getCoursesIndex();
    const response = await index.addDocuments([courseDocument]);
    return response
  }

  public async searchForCourse(searchTerm: string, limit = 8) {
    const index = await this.getCoursesIndex()
    await index.updateFilterableAttributes(['courseCode', 'courseName']);
    const searchResponse = await index.search(
      searchTerm,
      {
        limit,
      },
    );

    const courseHits: CourseDocument[] = searchResponse.hits as CourseDocument[];
    return courseHits
  }
}
