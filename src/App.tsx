import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Details from './pages/Details';
import Favorites from './pages/Favorites';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<Details />} />
          {/* ✅ usa a página de favoritos correta */}
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
      <main id="conteudo">
  {/* suas rotas */}
</main>

    </>
  );
}
