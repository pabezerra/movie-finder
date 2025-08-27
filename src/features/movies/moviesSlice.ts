import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { MoviesState } from './types'
import type { Movie, Genre, Paged } from '../../services/tmdb'
import { getPopular, searchMovies, discoverByGenre, getGenres } from '../../services/tmdb'

const FAVORITES_KEY = 'movies:favorites'

function loadFavorites(): number[] {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
  } catch {
    // noop
    return []
  }
}

function saveFavorites(ids: number[]) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
  } catch {
    // noop
  }
}

export const fetchGenres = createAsyncThunk<Genre[]>(
  'movies/fetchGenres',
  async () => (await getGenres()).genres
)

export const fetchPopular = createAsyncThunk<Paged<Movie>, { page?: number }>(
  'movies/fetchPopular',
  async ({ page = 1 }) => getPopular(page)
)

export const fetchByQuery = createAsyncThunk<Paged<Movie>, { query: string; page?: number }>(
  'movies/fetchByQuery',
  async ({ query, page = 1 }) => searchMovies(query, page)
)

export const fetchByGenre = createAsyncThunk<Paged<Movie>, { genreId: number; page?: number }>(
  'movies/fetchByGenre',
  async ({ genreId, page = 1 }) => discoverByGenre(genreId, page)
)

const initialState: MoviesState = {
  items: [],
  page: 1,
  totalPages: 1,
  query: '',
  genreId: null,
  genres: [],
  status: 'idle',
  error: null,
  favorites: loadFavorites()
}

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload
      state.page = 1
    },
    setGenre(state, action: PayloadAction<number | null>) {
      state.genreId = action.payload
      state.page = 1
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
    toggleFavorite(state, action: PayloadAction<number>) {
      const id = action.payload
      const idx = state.favorites.indexOf(id)
      if (idx >= 0) state.favorites.splice(idx, 1)
      else state.favorites.push(id)
      saveFavorites(state.favorites)
    }
  },

  // AQUI entram os thunks assíncronos
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.genres = action.payload
      })

      .addCase(fetchPopular.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(fetchPopular.fulfilled, (s, a) => {
        s.status = 'idle'
        s.items = a.payload.results
        s.page = a.payload.page
        s.totalPages = Math.min(a.payload.total_pages, 500)
      })
      .addCase(fetchPopular.rejected, (s, a) => {
        s.status = 'error'
        s.error = a.error.message || 'Erro'
      })

      .addCase(fetchByQuery.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(fetchByQuery.fulfilled, (s, a) => {
        s.status = 'idle'
        s.items = a.payload.results
        s.page = a.payload.page
        s.totalPages = Math.min(a.payload.total_pages, 500)
      })
      .addCase(fetchByQuery.rejected, (s, a) => {
        s.status = 'error'
        s.error = a.error.message || 'Erro'
      })

      .addCase(fetchByGenre.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(fetchByGenre.fulfilled, (s, a) => {
        s.status = 'idle'
        s.items = a.payload.results
        s.page = a.payload.page
        s.totalPages = Math.min(a.payload.total_pages, 500)
      })
      .addCase(fetchByGenre.rejected, (s, a) => {
        s.status = 'error'
        s.error = a.error.message || 'Erro'
      })
  }
})

export const { setQuery, setGenre, setPage, toggleFavorite } = moviesSlice.actions
export default moviesSlice.reducer
