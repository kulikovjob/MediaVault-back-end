import dotenv from 'dotenv';
import { Genre } from '../types/types';
import { BaseModel } from './baseModel';

dotenv.config({ path: './.env' });

// eslint-disable-next-line import/prefer-default-export
export class GenreModel extends BaseModel {

  async getAllGenres() {
    return this.db.manyOrNone(
      `
      SELECT * FROM "Genres"
    `);
  }

  async getGenreById(genreId: string) {
    return this.db.oneOrNone(
      `
    SELECT * FROM "Genres"
    WHERE genre_id = $1
    `,
      genreId,
    );
  }

  async addNewGenre(data: Partial<Genre>) {
    return this.db.one(
      'INSERT INTO public."Genres" (name, description) VALUES ($1, $2) RETURNING genre_id;',
      [...Object.values(data)],
    );
  }

  async updateGenre(genreId: string, newData: any) {
    return this.db.one(
      `
    UPDATE "Genres"
    SET ${Object.keys(newData)
        .filter(key => newData[key] !== undefined)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ')}
    WHERE genre_id = $${Object.keys(newData).length + 1}
    RETURNING *;
    `,
      [...Object.values(newData).filter(value => value !== undefined), genreId],
    );
  }

  async deleteGenreById(genreId: string) {
    return this.db.none(
      'DELETE FROM public."Genres" WHERE genre_id = $1',
      [genreId],
    );
  }

  async getId() {
    return this.db.oneOrNone('SELECT MAX(genre_id) FROM public."Genres"');
  }
}