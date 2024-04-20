import dotenv from 'dotenv';
import {  View } from '../types/types';
import { BaseModel } from './baseModel';

dotenv.config({ path: './.env' });

// eslint-disable-next-line import/prefer-default-export
export class ViewModel extends BaseModel {

  async getViewsByFileId(fileId: string, fileTypeId: string) {
    return this.db.any('SELECT * FROM public.get_views_by_file_id($1, $2)', [
      parseInt(fileTypeId, 10),
      parseInt(fileId, 10),
    ]);
  }

  async getViewsByPeriod(startDate: Date, endDate: Date) {
    return this.db.any('SELECT * FROM public.get_views_by_period($1, $2)', [
      startDate,
      endDate,
    ]);
  }

  async getPopularFilesByPeriod(startDate: Date, endDate: Date) {
    return this.db.any('SELECT * FROM public.get_popular_files_by_period($1, $2)', [
      startDate,
      endDate,
    ]);
  }

  async getPopularGenresByPeriod(startDate: Date, endDate: Date) {
    return this.db.any('SELECT * FROM public.get_popular_genres_by_period($1, $2)', [
      startDate,
      endDate,
    ]);
  }

  async getPopularTagsByPeriod(startDate: Date, endDate: Date) {
    return this.db.any('SELECT * FROM public.get_popular_tags_by_period($1, $2)', [
      startDate,
      endDate,
    ]);
  }

  async getAuthorsByPopularity(startDate: Date, endDate: Date) {
    return this.db.any('SELECT * FROM public.get_authors_by_popularity($1, $2)', [
      startDate,
      endDate,
    ]);
  }

  async getSortedFilesByViews(data: Partial<View>) {
    return this.db.any('SELECT * FROM public.count_views_with_file_info($1, $2, $3, $4)', [
      data.criteria,
      data.value,
      data.start_date,
      data.end_date,
    ]);
  }
}