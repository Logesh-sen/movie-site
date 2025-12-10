import { Heart } from "lucide-react";
import { type Movie } from "../api/movies";

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: (movieId: number, e: React.MouseEvent) => void;
  onClick: (movie: Movie) => void;
}

export default function MovieCard({ movie, isFavorite, onToggleFavorite, onClick }: MovieCardProps) {
  return (
    <div 
      className="group bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition-all duration-300 hover:shadow-lg cursor-pointer transform hover:scale-105" 
      onClick={() => onClick(movie)}
    >
      {movie.poster_path && (
        <div className="relative overflow-hidden">
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title} 
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-xs font-medium">Click for details</p>
          </div>
          <button
            onClick={(e) => onToggleFavorite(movie.id, e)}
            className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 group/heart"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`w-6 h-6 transition-all duration-200 ${
                isFavorite 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-white group-hover/heart:text-red-500'
              }`}
            />
          </button>
        </div>
      )}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-card-foreground line-clamp-2 mb-1 leading-tight">{movie.title}</h3>
        <p className="text-xs text-muted-foreground">{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</p>
      </div>
    </div>
  );
}