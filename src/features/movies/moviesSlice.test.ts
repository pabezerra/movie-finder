// importa as funções do Vitest (assim funciona mesmo sem globals)
import { test, expect, describe } from 'vitest'

// importa o reducer e as actions do slice
import reducer, { setPage, setQuery, toggleFavorite } from './moviesSlice.ts'

// importa o tipo do estado
import type { MoviesState } from './types'

// estado inicial para os testes
const initial: MoviesState = {
  items: [],
  page: 1,
  totalPages: 1,
  query: '',
  genreId: null,
  genres: [],
  status: 'idle',
  error: null,
  favorites: []
}

describe('moviesSlice', () => {
  test('setPage altera página', () => {
    const next = reducer(initial, setPage(3))
    expect(next.page).toBe(3)
  })

  test('setQuery define busca e reseta página', () => {
    const next = reducer({ ...initial, page: 9 }, setQuery('matrix'))
    expect(next.query).toBe('matrix')
    expect(next.page).toBe(1)
  })

  test('toggleFavorite adiciona e remove', () => {
    const add = reducer(initial, toggleFavorite(7))
    expect(add.favorites).toContain(7)
    const rem = reducer(add, toggleFavorite(7))
    expect(rem.favorites).not.toContain(7)
  })
})
