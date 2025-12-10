import { type Movie } from "../api/movies";
import MovieCard from "./MovieCard";

interface MovieGridProps {
  movies: Movie[];
  favorites: Set<number>;
  onToggleFavorite: (movieId: number, e: React.MouseEvent) => void;
  onMovieClick: (movie: Movie) => void;
}

export default function MovieGrid({ movies, favorites, onToggleFavorite, onMovieClick }: MovieGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
      {movies.map((movie: Movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isFavorite={favorites.has(movie.id)}
          onToggleFavorite={onToggleFavorite}
          onClick={onMovieClick}
        />
      ))}
    </div>
  );
}