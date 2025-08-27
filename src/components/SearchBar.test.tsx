import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from '../features/movies/moviesSlice';
import type { MoviesState } from '../features/movies/types';


// Mocka APENAS os thunks para não fazer rede
import * as moviesModule from '../features/movies/moviesSlice';
vi.mock('../features/movies/moviesSlice', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../features/movies/moviesSlice')>();
  return {
    ...actual,
    fetchByQuery: vi.fn(() => {
      // retorna um thunk no-op
      return async () => {};
    }),
    fetchPopular: vi.fn(() => {
      return async () => {};
    }),
  };
});

function makeStore(preloaded?: Partial<MoviesState>) {
  // estado base com todos os campos exigidos pelo reducer
  const baseDefault: MoviesState = {
    items: [],
    page: 5,
    totalPages: 1,
    query: '',
    genreId: 99,
    genres: [],
    status: 'idle',
    error: null,
    favorites: [],
  };

  // combina base + sobrescritas do teste
  const baseState: MoviesState = { ...baseDefault, ...(preloaded ?? {}) };

  return configureStore({
    reducer: { movies: moviesReducer },
    preloadedState: { movies: baseState },
  });
}

import SearchBar from './SearchBar';

describe('SearchBar', () => {
  test('dispara busca quando há texto e reseta página para 1', () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Buscar filmes...') as HTMLInputElement;
    const button = screen.getByRole('button', { name: /buscar/i });

    fireEvent.change(input, { target: { value: 'matrix' } });
    fireEvent.click(button);

    const state = store.getState().movies;
    expect(state.query).toBe('matrix');
    expect(state.page).toBe(1);

    // thunk mockado foi chamado
    expect((moviesModule.fetchByQuery as unknown as { mock: { calls: unknown[] } }).mock.calls.length).toBeGreaterThan(0);
  });

  test('reset para populares quando o campo está vazio (limpa gênero)', () => {
    const store = makeStore({ query: 'antes', page: 3, genreId: 18 });

    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Buscar filmes...') as HTMLInputElement;
    const button = screen.getByRole('button', { name: /buscar/i });

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(button);

    const state = store.getState().movies;
    expect(state.query).toBe('');
    expect(state.page).toBe(1);
    expect(state.genreId).toBeNull();

    expect((moviesModule.fetchPopular as unknown as { mock: { calls: unknown[] } }).mock.calls.length).toBeGreaterThan(0);
  });
});
