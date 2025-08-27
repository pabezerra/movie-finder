import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { MovieDetails } from '../services/tmdb';
import { posterUrl } from '../services/tmdb';

export default function Details() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<MovieDetails | null>(null);
  const [status, setStatus] = useState<'loading' | 'idle' | 'error'>('loading');

  useEffect(() => {
    if (!id) return; // sem id na URL, não tenta carregar

    let canceled = false;

    async function load() {
      try {
        setStatus('loading');
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?language=pt-BR&api_key=${import.meta.env.VITE_TMDB_API_KEY}`
        );
        if (!res.ok) throw new Error('Erro ao carregar detalhes');
        const json = (await res.json()) as MovieDetails;
        if (!canceled) {
          setData(json);
          setStatus('idle');
        }
      } catch {
        // não precisamos do erro aqui; só mudamos o status
        if (!canceled) setStatus('error');
      }
    }

    load();
    return () => {
      canceled = true;
    };
  }, [id]);

  if (status === 'loading')
    return (
      <div className="container">
        <div className="skeleton poster" style={{ width: 260, height: 390 }} />
      </div>
    );

  if (status === 'error' || !data)
    return (
      <div className="container">
        <p className="helper">Erro ao carregar detalhes.</p>
      </div>
    );

  return (
    <div className="container detail">
      <img src={posterUrl(data.poster_path, 'w500')} alt={`Poster de ${data.title}`} />
      <div>
        <h1>{data.title}</h1>
        <p className="meta">
          {new Date(data.release_date || '1970-01-01').getFullYear()} · ⭐ {data.vote_average?.toFixed(1)} ·{' '}
          {data.runtime} min
        </p>
        <div style={{ margin: '8px 0 10px' }}>
          {data.genres?.map((g) => (
            <span key={g.id} className="badge">
              {g.name}
            </span>
          ))}
        </div>
        <p>{data.overview || 'Sem sinopse.'}</p>
      </div>
    </div>
  );
}
