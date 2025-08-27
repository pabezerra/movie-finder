import type { RootState } from '../../app/store';

export const selectMovies      = (s: RootState) => s.movies.items;
export const selectStatus      = (s: RootState) => s.movies.status;
export const selectPage        = (s: RootState) => s.movies.page;
export const selectTotalPages  = (s: RootState) => s.movies.totalPages;
export const selectQuery       = (s: RootState) => s.movies.query;
export const selectGenreId     = (s: RootState) => s.movies.genreId;
export const selectGenres      = (s: RootState) => s.movies.genres;
export const selectFavorites   = (s: RootState) => s.movies.favorites;
