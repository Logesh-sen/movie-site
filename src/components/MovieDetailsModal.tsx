import { useQuery } from "@tanstack/react-query";
import { getMovieDetails, type Movie } from "../api/movies";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface MovieDetailsModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MovieDetailsModal({ movie, isOpen, onClose }: MovieDetailsModalProps) {
  const { data: movieDetails } = useQuery<Movie | null>({
    queryKey: ["movieDetails", movie?.id],
    queryFn: () => movie ? getMovieDetails(movie.id) : null,
    enabled: !!movie,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto hide-scrollbar p-0 gap-0 border-4 border-border bg-card">
        {movie && movieDetails && (
          <div className="relative">
            {movieDetails.backdrop_path && (
              <div className="relative h-64 sm:h-80 overflow-hidden">
                <img 
                  src={`https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`} 
                  alt={movieDetails.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              </div>
            )}
            <div className="p-6 sm:p-8 space-y-6 bg-card text-card-foreground">
              <div className="space-y-3">
                <DialogHeader>
                  <DialogTitle className="text-3xl sm:text-4xl font-black leading-tight text-foreground">{movieDetails.title}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-wrap items-center gap-4">
                  {movieDetails.release_date && (
                    <div className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                      <span className="inline-block w-2 h-2 bg-primary rounded-full" />
                      Released: {new Date(movieDetails.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  )}
                  {movieDetails.vote_average && (
                    <div className="bg-primary text-white border-2 border-border px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold text-sm">
                      ⭐ {movieDetails.vote_average.toFixed(1)}/10
                    </div>
                  )}
                </div>
              </div>
              
              {movieDetails.overview && (
                <div className="space-y-3">
                  <h4 className="text-xl font-bold border-l-4 border-primary pl-3 text-foreground">Overview</h4>
                  <p className="text-base leading-relaxed text-muted-foreground">{movieDetails.overview}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}