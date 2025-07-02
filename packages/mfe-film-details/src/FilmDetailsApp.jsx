// packages/mfe-your-feature-name/src/YourFeatureApp.jsx
import React, { useEffect, useState } from 'react';
import { Button } from 'shared-components';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';

const DetailsPage = () => {  
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  if (!API_KEY) {
    console.error(
      "TMDB_API_KEY no está configurada en las variables de entorno",
    );
  }
  const BASE_URL = "https://api.themoviedb.org/3";
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  const fetchMovie = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES`,
      );
      if (!response.ok) {
        throw new Error("Error al cargar la película");
      };
      const data = await response.json();
      setMovie(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    };
  };
  useEffect(() => {
    fetchMovie();
  }, []);
  if (loading && !movie) {
    return (
      <p>Cargando película</p>
    );
  };
  if (error) {
    return (
      <p>Error al cargar película</p>
    );
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Film Details Microfrontend</h2>
      <p className="mb-4">Welcome to Details Feature!</p>
      <p>La pelicula es {movie.title}</p>
      <p>{new Date(movie.release_date).getFullYear()}</p>
      <p>{movie.overview || "Sin descripción disponible"}</p>
      <Button 
        onClick={() => console.log('Button clicked!')}
        className="bg-blue-500 hover:bg-blue-700"
      >
        Click Me
      </Button>

      <img
          src={movie.poster_path
            ? `${IMAGE_BASE_URL}${movie.poster_path}`
            : "https://placehold.co/300x450/gray/white?text=Sin+Imagen"}
          alt={movie.title}
        />
    </div>
  );
};

const FilmDetailsApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/details/:id" element={<DetailsPage />} />
        <Route path="/:id" element={<DetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default FilmDetailsApp;