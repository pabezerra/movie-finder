import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchByGenre, fetchByQuery, fetchPopular } from '../features/movies/moviesSlice';
import { selectGenreId, selectMovies, selectPage, selectQuery, selectStatus } from '../features/movies/selectors';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';
import SkeletonCard from '../components/Skeleton';
import ErrorState from '../components/ErrorState';

export default function Home() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectMovies);
  const status = useAppSelector(selectStatus);
  const page = useAppSelector(selectPage);
  const genreId = useAppSelector(selectGenreId);
  const query = useAppSelector(selectQuery);

  useEffect(() => {
  if (query.trim()) {
    dispatch(fetchByQuery({ query, page }));
  } else if (genreId) {
    dispatch(fetchByGenre({ genreId, page }));
  } else {
    dispatch(fetchPopular({ page }));
  }

}, [dispatch, page, genreId, query]);


  return (
    <div className="container">
      <h1 style={{ margin: '14px 0 6px' }}>Catálogo de filmes</h1>
      <p className="helper" aria-live="polite">
  {status === 'loading' ? 'Carregando…' : `${items.length} resultados nesta página`}
</p>

      <p className="helper">Busque por título, filtre por gênero e salve seus favoritos.</p>

      <SearchBar />
      <GenreFilter />

      {status === 'loading' && (
        <div className="grid">{Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      )}

      {status === 'error' && <ErrorState message="Falha ao carregar" onRetry={() => {
        if (query.trim()) dispatch(fetchByQuery({ query, page }));
        else if (genreId) dispatch(fetchByGenre({ genreId, page }));
        else dispatch(fetchPopular({ page }));
      }} />}

      {status === 'idle' && (
        <>
          {status === 'idle' && items.length === 0 && (
  <div className="helper" role="status" aria-live="polite" style={{ marginTop: 8 }}>
    Nenhum filme encontrado para sua busca/filtro.
    <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
      <button className="btn" onClick={() => {
        // reset rápido
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // se quiser, também pode dispatch(setQuery('')); dispatch(setGenre(null)); dispatch(fetchPopular({ page: 1 }));
        location.href = '/'; // simples e eficiente
      }}>
        Limpar filtros
      </button>
    </div>
  </div>
)}

          <div className="grid">
            {items.map(m => <MovieCard key={m.id} movie={m} />)}
          </div>
          <Pagination />
        </>
      )}
    </div>
  );
}
