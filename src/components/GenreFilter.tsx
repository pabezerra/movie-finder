import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchByGenre, fetchGenres, fetchPopular, setGenre, setPage } from '../features/movies/moviesSlice';
import { selectGenreId, selectGenres } from '../features/movies/selectors';

export default function GenreFilter() {
  const dispatch = useAppDispatch();
  const genres = useAppSelector(selectGenres);
  const selected = useAppSelector(selectGenreId);

  useEffect(() => { if (!genres.length) dispatch(fetchGenres()); }, [dispatch, genres.length]);

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value ? Number(e.target.value) : null;
    dispatch(setPage(1));
    dispatch(setGenre(id));
    if (id) dispatch(fetchByGenre({ genreId: id, page: 1 })); else dispatch(fetchPopular({ page: 1 }));
  }

  return (
    <div className="controls" role="group" aria-label="Filtro por gênero">
      <select className="select" value={selected ?? ''} onChange={onChange} aria-label="Gênero">
        <option value="">Todos os gêneros</option>
        {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
      </select>
    </div>
  );
}
