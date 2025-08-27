const API = 'https://api.themoviedb.org/3';
const KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined;

if (!KEY) console.warn('VITE_TMDB_API_KEY ausente no .env');

/** ===== Tipos ===== */
export type Genre = { id: number; name: string };

export type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;        // pode vir vazio do TMDB
  vote_average?: number;        // pode vir indefinido
  genre_ids?: number[];
  overview?: string;            // usado na página de detalhes
};

export type MovieDetails = Movie & {
  genres: Genre[];
  runtime?: number;
  backdrop_path: string | null;
};

export type Paged<T> = {
  page: number;
  total_pages: number;
  results: T[];
};

/** ===== Util para querystring ===== */
const q = (params: Record<string, string | number | undefined>) =>
  new URLSearchParams({
    language: 'pt-BR',
    include_adult: 'false',
    api_key: KEY || '',
    ...Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined)),
  }).toString();

/** ===== Endpoints ===== */
export async function getPopular(page = 1): Promise<Paged<Movie>> {
  const res = await fetch(`${API}/movie/popular?${q({ page })}`);
  if (!res.ok) throw new Error('Falha ao carregar populares');
  return res.json();
}

export async function searchMovies(query: string, page = 1): Promise<Paged<Movie>> {
  const res = await fetch(`${API}/search/movie?${q({ query, page })}`);
  if (!res.ok) throw new Error('Falha na busca');
  return res.json();
}

export async function discoverByGenre(genreId: number, page = 1): Promise<Paged<Movie>> {
  const res = await fetch(`${API}/discover/movie?${q({ with_genres: genreId, sort_by: 'popularity.desc', page })}`);
  if (!res.ok) throw new Error('Falha no discover');
  return res.json();
}

export async function getGenres(): Promise<{ genres: Genre[] }> {
  const res = await fetch(`${API}/genre/movie/list?${q({})}`);
  if (!res.ok) throw new Error('Falha ao carregar gêneros');
  return res.json();
}

export async function getMovieDetails(id: number) {
  const res = await fetch(`${API}/movie/${id}?${q({})}`);
  if (!res.ok) throw new Error('Falha ao carregar detalhes do filme');
  return res.json();
}

/** ===== Imagens ===== */
export function posterUrl(path: string | null, size: 'w185' | 'w342' | 'w500' = 'w342') {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : `https://placehold.co/342x513?text=Sem+Poster`;
}
