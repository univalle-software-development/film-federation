import React, { useEffect, useState } from 'react';
import { Button } from 'shared-components';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import './index.css';

const DetailsPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ADVERTENCIA DE SEGURIDAD: CLAVES HARCODEADAS DIRECTAMENTE EN EL CÓDIGO.
  // ESTO NO ES SEGURO PARA PRODUCCIÓN Y DEBE EVITARSE SI ES POSIBLE.
  const API_KEY = "4c0f24bb91c4a19ce18b6135d4e80707";
  const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YzBmMjRiYjkxYzRhMTljZTE4YjYxMzVkNGU4MDcwNyIsIm5iZiI6MTc1MjM1MTg3OS4wMiwic3ViIjoiNjg3MmM0ODdmNmJiMDdiNWIyYzViODIwIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.TmVhDXj76KouXubaH4MEobYFlDc1ba60grkZ6QFsl7c";

  const BASE_URL = "https://api.themoviedb.org/3";
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

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
        <Button variant="primary" onClick={() => {
          // Opción 1: Navegar a la ruta raíz del host si es donde está el catálogo
          window.location.href = '/'; 
          // Opción 2 (más segura para volver atrás):
          // window.history.back(); 
          // Opción 3 (si el catálogo está en una ruta específica):
          // window.location.href = '/catalogo'; // O la ruta correcta
        }} className="mt-6">
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
            <Button variant="secondary" onClick={() => {
              // Si navigate('/') no funciona, prueba con window.location.href o window.history.back()
              // Opción más fiable para MFEs: redirigir a una URL absoluta que sabes que es la del catálogo.
              // Reemplaza '/ruta-a-tu-catalogo' con la URL real donde está el catálogo.
              window.location.href = '/'; // Prueba con la raíz
              // O si tienes una ruta específica:
              // window.location.href = '/catalogo';
              // O para simplemente ir a la página anterior en el historial:
              // window.history.back();
            }}>
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