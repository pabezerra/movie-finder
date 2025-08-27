import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectFavorites } from '../features/movies/selectors';
import { toggleFavorite } from '../features/movies/moviesSlice';
import { getMovieDetails, posterUrl } from '../services/tmdb';
import type { MovieDetails } from '../services/tmdb';
import SkeletonCard from '../components/Skeleton';


export default function Favorites() {
  const ids = useAppSelector(selectFavorites);
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<MovieDetails[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  useEffect(() => {
    if (!ids.length) { setItems([]); return; }

    let canceled = false;
    async function run() {
      try {
        setStatus('loading');
        const movies = await Promise.all(ids.map(id => getMovieDetails(id)));
        if (!canceled) { setItems(movies); setStatus('idle'); }
      } catch {
        if (!canceled) setStatus('error');
      }
    }
    run();
    return () => { canceled = true; };
  }, [ids]);

  function remove(id: number) {
    dispatch(toggleFavorite(id));
    // o estado global muda e o efeito acima recarrega a lista automaticamente
  }

  return (
    <div className="container">
      <h1 style={{ margin: '14px 0 6px' }}>Favoritos</h1>

      {!ids.length && <p className="helper">Você ainda não favoritou nenhum filme.</p>}
      {status === 'loading' && (
  <div className="grid">
    {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
)}

      {status === 'error' && <p className="helper">Não foi possível carregar seus favoritos.</p>}

      {status === 'idle' && !!items.length && (
        <div className="grid">
          {items.map(m => (
            <article key={m.id} className="card">
              {/* Botão de remover no canto do poster */}
              <button
                className="iconBtn favToggle danger"
                aria-label={`Remover ${m.title} dos favoritos`}
                title="Remover dos favoritos"
                onClick={() => remove(m.id)}
              >
                {/* pequeno ícone (estrela preenchida) */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </button>

              <Link to={`/movie/${m.id}`} aria-label={`Detalhes de ${m.title}`}>
                <img src={posterUrl(m.poster_path)} alt={`Poster de ${m.title}`} loading="lazy" />
              </Link>

              <div className="body">
                <div>
                  <div className="title" title={m.title}>{m.title}</div>
                  <div className="meta">
                    {new Date(m.release_date || '1970-01-01').getFullYear()} · ⭐ {m.vote_average?.toFixed(1)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link to={`/movie/${m.id}`} className="btn" style={{ flex: 1 }}>Abrir</Link>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => remove(m.id)}
                    aria-label={`Remover ${m.title} dos favoritos`}
                  >
                    Remover
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
