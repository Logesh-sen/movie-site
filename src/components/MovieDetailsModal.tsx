import { useQuery } from "@tanstack/react-query";
import { getMovieDetails, type Movie } from "../api/movies";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface MovieDetailsModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MovieDetailsModal({ movie, isOpen, onClose }: MovieDetailsModalProps) {
  const { data: details } = useQuery<Movie | null>({
    queryKey: ["movieDetails", movie?.id],
    queryFn: () => movie ? getMovieDetails(movie.id) : null,
    enabled: !!movie,
  });

  const trailer = details?.videos?.results?.find(
    video => video.site === 'YouTube' && video.type === 'Trailer' && video.official
  ) || details?.videos?.results?.find(
    video => video.site === 'YouTube' && video.type === 'Trailer'
  );

  const openTrailer = () => {
    if (trailer) {
      window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm sm:max-w-md md:max-w-4xl lg:max-w-6xl xl:max-w-7xl max-h-[90vh] md:max-h-[95vh] lg:max-h-[90vh] overflow-y-auto hide-scrollbar p-0">
        {movie && details && (
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 lg:w-2/5">
              {details.backdrop_path || details.poster_path ? (
                <div className="relative h-64 md:h-full md:min-h-[500px] lg:min-h-[600px] xl:min-h-[700px]">
                  <img 
                    src={`https://image.tmdb.org/t/p/original${details.backdrop_path || details.poster_path}`} 
                    alt={details.title} 
                    className="w-full object-container h-full" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-r md:bg-gradient-to-l from-transparent via-transparent to-card/20" />
                </div>
              ) : (
                <div className="h-64 md:h-full md:min-h-[500px] lg:min-h-[600px] xl:min-h-[700px] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-center px-4">{details.title}</h3>
                </div>
              )}
            </div>
            
            <div className="md:w-1/2 lg:w-3/5 p-6 md:p-8 lg:p-10 xl:p-12 space-y-6 md:space-y-8">
              <DialogHeader>
                <DialogTitle className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black leading-tight">{details.title}</DialogTitle>
              </DialogHeader>
              
              <div className="flex flex-wrap items-center gap-4 md:gap-6 justify-between">
                {details.release_date && (
                  <p className="text-muted-foreground text-base md:text-lg">Released: {new Date(details.release_date).toLocaleDateString()}</p>
                )}
                {details.vote_average && (
                  <div className="bg-primary text-primary-foreground px-4 py-2 md:px-5 md:py-3 rounded-md font-bold text-sm md:text-base">
                    ⭐ {details.vote_average.toFixed(1)}/10
                  </div>
                )}
              </div>

              {details.genres && details.genres.length > 0 && (
                <div>
                  <h4 className="text-lg md:text-xl font-bold mb-3">Genres</h4>
                  <div className="flex flex-wrap gap-2">
                    {details.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {trailer && (
                <div>
                  <Button
                    onClick={openTrailer}
                    className="flex items-center gap-2 bg-destructive hover:bg-destructive text-white px-6 py-3 text-base md:text-lg font-semibold"
                  >
                    <Play className="w-5 h-5" />
                    Watch Trailer
                  </Button>
                </div>
              )}
              
              {details.overview && (
                <div>
                  <h4 className="text-l md:text-l lg:text-xl font-bold mb-4 md:mb-6">Overview</h4>
                  <p className="leading-relaxed text-muted-foreground text-base md:text-lg lg:text-l">{details.overview}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}