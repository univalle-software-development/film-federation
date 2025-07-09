import React, { useEffect, useState } from "react";
import { Button, SearchBar } from "shared-components";
import "./index.css";
const FilmCatalogApp = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const TOKEN = process.env.TOKEN_READ_ACCES;
  if (!API_KEY) {
    console.error(
      "TMDB_API_KEY no está configurada en las variables de entorno",
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
        ? `/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=es-ES&page=${page}`
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

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchMovies(1, query);
  };

  const loadMoreMovies = () => {
    fetchMovies(currentPage + 1);
  };
  const MovieCard = ({ movie }) => (
    <div
      onClick={() => goToDetails(movie.id)}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative">
        <img
          src={movie.poster_path
            ? `${IMAGE_BASE_URL}${movie.poster_path}`
            : "https://placehold.co/300x450/gray/white?text=Sin+Imagen"}
          alt={movie.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
          ⭐ {movie.vote_average.toFixed(1)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-gray-600 text-sm mb-2">
          📅 {new Date(movie.release_date).getFullYear()}
        </p>
        <p className="text-gray-700 text-sm line-clamp-3">
          {movie.overview || "Sin descripción disponible"}
        </p>
      </div>
    </div>
  );
  if (loading && movies.length === 0) {
    return (
      <div className="max-w-6xl mx-auto my-8 p-6">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-700">
            🎬 Film Catalog MFE
          </h1>
          <p className="text-gray-500 mt-2">Cargando películas...</p>
        </header>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700">
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-6xl mx-auto my-8 p-6">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-700">
            🎬 Film Catalog MFE
          </h1>
          <p className="text-gray-500 mt-2">Error al cargar películas</p>
        </header>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 mb-4">❌ {error}</p>
          <Button
            variant="primary"
            onClick={() => fetchMovies(1)}
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto my-8 p-6">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-700">
          🎬 Film Catalog MFE
        </h1>
        <p className="text-gray-500 mt-2">
          {searchQuery ? `Resultados para "${searchQuery}"` : "Descubre las películas más populares"}
        </p>
      </header>
      <div className="mb-6 flex flex-wrap justify-center gap-4">
        <SearchBar placeholder="Buscar películas..." onSearch={handleSearch} />
        <Button
          variant="primary"
          onClick={() => {setSearchQuery(""); fetchMovies(1)}}
          disabled={loading}
        >
          🔄 Actualizar Catálogo
        </Button>
      </div>
      {movies.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
          <div className="text-center">
            <Button
              variant="outline"
              onClick={loadMoreMovies}
              disabled={loading}
              className="px-8 py-3"
            >
              {loading ? "⏳ Cargando..." : "📚 Cargar Más Películas"}
            </Button>
          </div>
        </>
      )}
      <footer className="mt-12 text-center text-sm text-gray-400">
        <p>Powered by Microfrontends & TMDB API</p>
        <p className="mt-1">Mostrando {movies.length} películas</p>
      </footer>
    </div>
  );
};
export default FilmCatalogApp;
