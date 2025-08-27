import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectPage, selectTotalPages, selectGenreId, selectQuery } from '../features/movies/selectors';
import { fetchByGenre, fetchByQuery, fetchPopular, setPage } from '../features/movies/moviesSlice';

export default function Pagination() {
  const dispatch = useAppDispatch();
  const page = useAppSelector(selectPage);
  const total = useAppSelector(selectTotalPages);
  const genreId = useAppSelector(selectGenreId);
  const query = useAppSelector(selectQuery);

  if (total <= 1) return null;

  function go(p: number) {
    if (p < 1 || p > total || p === page) return;
    dispatch(setPage(p));
    if (query.trim()) dispatch(fetchByQuery({ query, page: p }));
    else if (genreId) dispatch(fetchByGenre({ genreId, page: p }));
    else dispatch(fetchPopular({ page: p }));
  }

  const pages = [page - 1, page, page + 1].filter(p => p >= 1 && p <= total);

  return (
  <nav className="pagination" aria-label="Paginação de resultados">
    <button className="pageBtn" aria-label="Primeira página" onClick={() => go(1)} disabled={page <= 1}>
      « Primeira
    </button>
    <button className="pageBtn" aria-label="Página anterior" onClick={() => go(page - 1)} disabled={page <= 1}>
      ‹ Anterior
    </button>

    {pages.map(p => (
      <button
        key={p}
        className={`pageBtn ${p === page ? 'active' : ''}`}
        aria-current={p === page ? 'page' : undefined}
        aria-label={`Ir para a página ${p}`}
        onClick={() => go(p)}
      >
        {p}
      </button>
    ))}

    <button className="pageBtn" aria-label="Próxima página" onClick={() => go(page + 1)} disabled={page >= total}>
      Próxima ›
    </button>
    <button className="pageBtn" aria-label="Última página" onClick={() => go(total)} disabled={page >= total}>
      Última »
    </button>
  </nav>
);

}
