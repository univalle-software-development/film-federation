import React, { useEffect, useState } from "react";
import { Button, SearchBar } from "shared-components";
import "./index.css";

const FilmCatalogApp = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("light");

  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const TOKEN = process.env.TOKEN_READ_ACCES;

  if (!API_KEY) {
    console.error(
      "TMDB_API_KEY no está configurada en las variables de entorno"
    );
  }

  const BASE_URL = "https://api.themoviedb.org/3";
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  const goToDetails = (id) => {
    window.history.pushState(null, "", `/details/${id}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const fetchMovies = async (page = 1, query = "") => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = query
        ? `/search/movie?query=${encodeURIComponent(
            query
          )}&include_adult=false&language=es-ES&page=${page}`
        : `/movie/popular?api_key=${API_KEY}&language=es-ES&page=${page}`;

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${TOKEN}`, accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Error al cargar las películas");
      }

      const data = await response.json();
      if (page === 1) {
        setMovies(data.results);
      } else {
        setMovies((prev) => [...prev, ...data.results]);
      }
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchMovies(1, query);
  };

  const loadMoreMovies = () => {
    fetchMovies(currentPage + 1, searchQuery);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const MovieCard = ({ movie }) => (
    <div
      onClick={() => goToDetails(movie.id)}
      className="movie-card bg-surface rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 cursor-pointer"
    >
      <div className="relative">
        <img
          src={
            movie.poster_path
              ? `${IMAGE_BASE_URL}${movie.poster_path}`
              : "https://placehold.co/300x450/gray/white?text=Sin+Imagen"
          }
          alt={movie.title}
          className="w-full h-80 object-cover"
        />
        <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
          ⭐ {movie.vote_average.toFixed(1)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2 text-on-surface line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-on-surface-variant text-sm mb-2">
          📅 {new Date(movie.release_date).getFullYear()}
        </p>
        <p className="text-on-surface-variant text-sm line-clamp-3">
          {movie.overview || "Sin descripción disponible"}
        </p>
      </div>
    </div>
  );

  if (loading && movies.length === 0) {
    return (
      <div className="app-container bg-background text-on-background min-h-screen flex flex-col items-center justify-center p-6">
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-extrabold text-primary mb-4">
            🎬 Film Catalog MFE
          </h1>
          <p className="text-on-background-variant text-lg">Cargando películas...</p>
        </header>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container bg-background text-on-background min-h-screen flex flex-col items-center justify-center p-6">
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-extrabold text-primary mb-4">
            🎬 Film Catalog MFE
          </h1>
          <p className="text-on-background-variant text-lg">Error al cargar películas</p>
        </header>
        <div className="bg-error-container border border-error rounded-xl p-8 text-center shadow-lg">
          <p className="text-error mb-6 text-lg">❌ {error}</p>
          <Button variant="primary" onClick={() => fetchMovies(1)}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container bg-background text-on-background min-h-screen p-6">
      <header className="mb-10 text-center relative">
        <h1 className="text-5xl font-extrabold text-primary mb-3">
          🎬 Film Catalog MFE
        </h1>
        <p className="text-on-background-variant text-lg">
          {searchQuery
            ? `Resultados para "${searchQuery}"`
            : "Descubre las películas más populares"}
        </p>
        <button
          onClick={toggleTheme}
          className="absolute top-0 right-0 p-3 rounded-full bg-surface-variant text-on-surface-variant shadow-md hover:bg-primary-container hover:text-on-primary-container transition-colors duration-300"
          aria-label="Toggle theme"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </header>

      <div className="mb-8 flex flex-wrap justify-center items-center gap-6">
        <SearchBar placeholder="Buscar películas..." onSearch={handleSearch} />
        <Button
          variant="secondary"
          onClick={() => {
            setSearchQuery("");
            fetchMovies(1);
          }}
          disabled={loading}
          className="px-6 py-3 text-lg font-semibold rounded-lg shadow-md"
        >
          🔄 Actualizar Catálogo
        </Button>
      </div>

      {movies.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          <div className="text-center">
            <Button
              variant="outline"
              onClick={loadMoreMovies}
              disabled={loading}
              className="px-10 py-4 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg"
            >
              {loading ? "⏳ Cargando..." : "📚 Cargar Más Películas"}
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center text-on-background-variant text-xl mt-12">
          No se encontraron películas para tu búsqueda.
        </div>
      )}

      <footer className="mt-16 text-center text-sm text-on-background-variant border-t border-outline pt-6">
        <p>Powered by Microfrontends & TMDB API</p>
        <p className="mt-2">Mostrando {movies.length} películas</p>
      </footer>
    </div>
  );
};

export default FilmCatalogApp;