import { useEffect, useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchByQuery, fetchPopular, setPage, setQuery, setGenre } from '../features/movies/moviesSlice';
import { selectQuery } from '../features/movies/selectors';

export default function SearchBar() {
  const dispatch = useAppDispatch();
  const query = useAppSelector(selectQuery);
  const [value, setValue] = useState(query);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch(setPage(1));
    dispatch(setQuery(value));
    if (value.trim()) dispatch(fetchByQuery({ query: value.trim(), page: 1 }));
    else { dispatch(setGenre(null)); dispatch(fetchPopular({ page: 1 })); }
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  // Debounce opcional: dispara busca 300ms após digitar
  useEffect(() => {
    const trimmed = value.trim();
    const t = setTimeout(() => {
      dispatch(setPage(1));
      dispatch(setQuery(value));
      if (trimmed) dispatch(fetchByQuery({ query: trimmed, page: 1 }));
    }, 300);
    return () => clearTimeout(t);
  }, [value, dispatch]);

  return (
    <form onSubmit={onSubmit} className="controls" aria-label="Busca de filmes">
      <input
        className="input"
        placeholder="Buscar filmes..."
        aria-label="Buscar filmes"
        value={value}
        onChange={onChange}
      />
      <button className="btn" type="submit">Buscar</button>
    </form>
  );
}
