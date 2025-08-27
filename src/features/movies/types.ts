import type { Movie, Genre } from '../../services/tmdb';
export type { Movie, Genre };

export type Status = 'idle' | 'loading' | 'error';

export interface MoviesState {
  items: Movie[];
  page: number;
  totalPages: number;
  query: string;
  genreId: number | null;
  genres: Genre[];
  status: Status;
  error: string | null;
  favorites: number[]; // ids
}
