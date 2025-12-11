import { useState, useEffect } from "react";
import { type Movie } from "../api/movies";

interface MovieSlideshowProps {
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

export default function MovieSlideshow({ movies, onMovieClick }: MovieSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (movies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => prev === movies.length - 1 ? 0 : prev + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, [movies.length]);

  useEffect(() => setCurrentIndex(0), [movies]);

  if (!movies.length) return null;

  const movie = movies[currentIndex];

  return (
    <div className="mt-6 relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden">
      {movie.backdrop_path ? (
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <h3 className="text-2xl font-bold">{movie.title}</h3>
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h2 className="text-2xl md:text-4xl font-bold mb-2">{movie.title}</h2>
        {movie.overview && (
          <p className="text-sm md:text-base text-gray-200 line-clamp-3 mb-4 max-w-2xl">{movie.overview}</p>
        )}
        <div className="flex items-center gap-4">
          {movie.release_date && <span className="text-sm">{new Date(movie.release_date).getFullYear()}</span>}
          {movie.vote_average && <span className="text-sm">⭐ {movie.vote_average.toFixed(1)}</span>}
        </div>
      </div>

      {movies.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {movies.map((_, i) => (
            <button
              key={i}
              className={`w-3 h-3 rounded-full ${i === currentIndex ? 'bg-white' : 'bg-white/50'}`}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
      )}

      {onMovieClick && (
        <button className="absolute inset-0" onClick={() => onMovieClick(movie)} />
      )}
    </div>
  );
}