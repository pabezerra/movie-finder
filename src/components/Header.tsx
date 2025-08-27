import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectFavorites } from '../features/movies/selectors';
import { setGenre, setPage, setQuery } from '../features/movies/moviesSlice';

export default function Header() {
  const favCount = useAppSelector(selectFavorites).length;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const resetFilters = () => {
    dispatch(setQuery(''));
    dispatch(setGenre(null));
    dispatch(setPage(1));
    navigate('/');
  };

  return (
    <header>
      <div className="inner container">
        <a className="brand" href="#" onClick={(e) => { e.preventDefault(); resetFilters(); }}>🎬 Movies</a>
        <nav>
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Início</NavLink>
          <NavLink to="/favorites" className={({ isActive }) => isActive ? 'active' : ''}>Favoritos ({favCount})</NavLink>
        </nav>
      </div>
    </header>
  );
}
