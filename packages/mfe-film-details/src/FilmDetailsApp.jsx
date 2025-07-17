import React, { useEffect, useState } from 'react';
import { Button } from 'shared-components';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import './index.css';

const DetailsPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const TOKEN = process.env.TOKEN_READ_ACCES;

  if (!API_KEY) {
    console.error(
      "TMDB_API_KEY no está configurada en las variables de entorno",
    );
  }

  const BASE_URL = "https://api.themoviedb.org/3";
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  const goToCatalog = () => {
    window.history.pushState(null, "", '/catalog');
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const fetchMovie = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES`,
        {
          headers: { Authorization: `Bearer ${TOKEN}`, accept: "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error("Error al cargar la película");
      }
      const data = await response.json();
      setMovie(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [id]);

  if (loading && !movie) {
    return (
      <div className="detail-container bg-background text-on-background min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300">
        <div className="loader"></div>
        <p className="text-on-background-variant text-xl mt-8">Cargando detalles de la película...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-container bg-background text-on-background min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300">
        <p className="text-error text-2xl font-semibold mb-6">❌ Error al cargar la película: {error}</p>
        <Button variant="primary" onClick={() => fetchMovie()}>
          Reintentar
        </Button>
      </div>
    );
  }
  
  if (!movie) {
    return (
      <div className="detail-container bg-background text-on-background min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300">
        <p className="text-on-background-variant text-2xl font-semibold">Película no encontrada.</p>
        <Button variant="primary"
          onClick={() => goToCatalog()}
          className="mt-6"
        >
          ⬅️ Volver al Catálogo
        </Button>
      </div>
    );
  }

  const posterUrl = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "https://placehold.co/300x450/gray/white?text=Sin+Imagen";

  return (
    <div className="detail-container bg-background text-on-background min-h-screen p-6 transition-colors duration-300">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-3">
          🎬 Detalles de la Película
        </h1>
        <p className="text-on-background-variant text-lg">Información completa sobre la obra.</p>
      </header>

      <div className="max-w-4xl mx-auto bg-surface rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="flex-shrink-0 w-full md:w-1/3">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="flex-grow text-center md:text-left">
          <h2 className="text-3xl font-bold text-on-surface mb-3">{movie.title}</h2>
          
          <p className="text-on-surface-variant text-lg mb-2 flex items-center justify-center md:justify-start">
            <span className="text-2xl mr-2">⭐</span> {movie.vote_average.toFixed(1)} / 10
            {movie.vote_count > 0 && (
              <span className="ml-4 text-on-surface-variant text-sm">({movie.vote_count} votos)</span>
            )}
          </p>
          
          <p className="text-on-surface-variant text-xl mb-4">
            📅 {new Date(movie.release_date).getFullYear()}
            {movie.runtime && <span className="ml-4">⏱️ {movie.runtime} min</span>}
          </p>
          
          {movie.genres && movie.genres.length > 0 && (
            <p className="text-on-surface-variant text-base mb-4">
              Géneros: {movie.genres.map(g => g.name).join(', ')}
            </p>
          )}
          
          <p className="text-on-surface text-lg leading-relaxed mb-6">
            {movie.overview || "Sin descripción disponible."}
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
            <Button variant="primary" onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' trailer')}`, '_blank')}>
              ▶️ Ver Trailer
            </Button>
            <Button variant="secondary" onClick={() => goToCatalog()}>
              ⬅️ Volver al Catálogo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilmDetailsApp = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <BrowserRouter>
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-surface shadow-md text-on-surface text-xl transition-colors duration-300 hover:scale-110 active:scale-95"
        aria-label="Toggle theme"
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      <Routes>
        <Route path="/details/:id" element={<DetailsPage />} />
        <Route path="/:id" element={<DetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default FilmDetailsApp;