import { Link } from 'react-router-dom';
import type { Movie } from '../services/tmdb';
import { posterUrl } from '../services/tmdb';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectFavorites } from '../features/movies/selectors';
import { toggleFavorite } from '../features/movies/moviesSlice';

export default function MovieCard({ movie }: { movie: Movie }) {
  const favs = useAppSelector(selectFavorites);
  const dispatch = useAppDispatch();
  const isFav = favs.includes(movie.id);

  return (
    <article className="card" aria-label={movie.title}>
      <Link to={`/movie/${movie.id}`} aria-label={`Detalhes de ${movie.title}`}>
        <img src={posterUrl(movie.poster_path)} alt={`Poster de ${movie.title}`} loading="lazy" />
      </Link>
      <div className="body">
        <div className="title" title={movie.title}>{movie.title}</div>
        <div className="meta">
          {new Date(movie.release_date || '1970-01-01').getFullYear()} · ⭐ {movie.vote_average?.toFixed(1)}
        </div>
        <div style={{ display:'flex', gap:8, marginTop:10 }}>
          <Link to={`/movie/${movie.id}`} className="btn" aria-label={`Abrir ${movie.title}`}>Abrir</Link>
          <button className="pageBtn" aria-pressed={isFav} onClick={() => dispatch(toggleFavorite(movie.id))}>
            {isFav ? '★ Remover' : '☆ Favoritar'}
          </button>
        </div>
      </div>
    </article>
  );
}
