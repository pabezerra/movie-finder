# 🎬 MovieFinder

Aplicação web para descobrir, buscar e favoritar filmes.  
Feita com **React + TypeScript + Redux Toolkit + Vite**.

🔗 **Demo online**: [MovieFinder na Vercel](https://movie-finder-7lfo.vercel.app/)

---

## ✨ Funcionalidades
- 🔍 Busca de filmes com debounce e paginação  
- 🎭 Filtro por gênero  
- 📖 Detalhes do filme (nota, sinopse, gêneros, duração)  
- ⭐ Favoritos com persistência em `localStorage`  
- ⏳ Skeletons de carregamento e estados de vazio/erro  
- ♿ Acessibilidade básica (foco visível, aria-labels, skip link)  

---

## 🚀 Tecnologias
- [React 18](https://react.dev/)  
- [TypeScript](https://www.typescriptlang.org/)  
- [Redux Toolkit](https://redux-toolkit.js.org/)  
- [React Router](https://reactrouter.com/)  
- [Vite](https://vitejs.dev/)  

---

## 🔧 Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Criar arquivo .env na raiz com sua chave da TMDB
echo "VITE_TMDB_API_KEY=SUA_CHAVE_TMDB" > .env

# 3. Rodar em modo dev
npm run dev
