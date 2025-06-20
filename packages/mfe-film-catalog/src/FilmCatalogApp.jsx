import React, { useEffect, useState } from "react";
import { Button } from "shared-components";
import "./index.css";
const FilmCatalogApp = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  if (!API_KEY) {
    console.error(
      "TMDB_API_KEY no está configurada en las variables de entorno",
    );
  }
  const BASE_URL = "https://api.themoviedb.org/3";
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
  const fetchMovies = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=${page}`,
      );
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
  const loadMoreMovies = () => {
    fetchMovies(currentPage + 1);
  };
  const MovieCard = ({ movie }) => (
    <div>
      <div className="p-4">
        <h3>
          {movie.title}
        </h3>
      </div>
    </div>
  );
  return (
    <div className="max-w-6xl mx-auto my-8 p-6">
      <header className="mb-8 text-center">
        <h1>
          🎬 Film Catalog MFE
        </h1>
      </header>
      {movies.length > 0 && (
        <>
          <div>
            {movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
          <div className="text-center">
            <Button
              onClick={loadMoreMovies}
              disabled={loading}
            >
              {loading ? "⏳ Cargando..." : "📚 Cargar Más Películas"}
            </Button>
          </div>
        </>
      )}
      <footer>
        {/* Acá podemos colocar la información del grupo de trabajo --> */}
      </footer>
    </div>
  );
};
export default FilmCatalogApp;
