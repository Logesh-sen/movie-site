import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMovies, type Movie, type MoviesResponse } from "../api/movies";
import MovieSlideshow from "../components/MovieSlideshow";
import AdvancedMovieSlideshow from "../components/AdvancedMovieSlideshow";
import MovieDetailsModal from "../components/MovieDetailsModal";
import { useFavorites } from "../hooks/useFavorites";
import { HyperText } from "@/components/ui/hyper-text";
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings } from "lucide-react";

export default function Slideshow() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();

  const { data, isPending, isError, refetch } = useQuery<MoviesResponse>({
    queryKey: ["slideshow-movies", currentPage],
    queryFn: () => fetchMovies(currentPage),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const loadMoreMovies = () => {
    setCurrentPage(prev => prev + 1);
  };

  const [allMovies, setAllMovies] = useState<Movie[]>([]);

  useEffect(() => {
    if (data?.results) {
      if (currentPage === 1) {
        setAllMovies(data.results);
      } else {
        setAllMovies(prev => [...prev, ...data.results]);
      }
    }
  }, [data, currentPage]);

  const CenteredMessage = ({ children, error }: { children: React.ReactNode; error?: boolean }) => (
    <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
      <p className={`text-lg ${error ? "text-destructive" : ""}`}>{children}</p>
    </div>
  );

  if (isPending && currentPage === 1) return <CenteredMessage>Loading slideshow…</CenteredMessage>;
  if (isError) return <CenteredMessage error>Error loading movies for slideshow.</CenteredMessage>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            <HyperText>Movie Slideshow</HyperText>
          </h1>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAdvancedMode(!isAdvancedMode)}
            >
              <Settings className="w-4 h-4 mr-2" />
              {isAdvancedMode ? 'Basic Mode' : 'Advanced Mode'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isPending}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isPending ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button
              variant="outline"
              onClick={loadMoreMovies}
              disabled={isPending}
            >
              Load More Movies
            </Button>
          </div>
        </div>

        {allMovies.length > 0 && (
          <div className="mb-8">
            {isAdvancedMode ? (
              <AdvancedMovieSlideshow
                movies={allMovies}
                autoPlayInterval={6000}
                showThumbnails={true}
                enableFullscreen={true}
                isFavorite={(movieId) => favorites.has(movieId)}
                onToggleFavorite={(movieId) => toggleFavorite(movieId, {} as React.MouseEvent)}
                onMovieClick={setSelectedMovie}
              />
            ) : (
              <MovieSlideshow
                movies={allMovies}
                onMovieClick={setSelectedMovie}
              />
            )}
          </div>
        )}

        <div className="text-center text-muted-foreground space-y-2">
          <p>Showing {allMovies.length} movies in {isAdvancedMode ? 'advanced' : 'basic'} slideshow mode</p>
          {isPending && currentPage > 1 && (
            <p>Loading more movies...</p>
          )}
          {isAdvancedMode && (
            <p></p>
          )}
        </div>

        <MovieDetailsModal
          movie={selectedMovie}
          isOpen={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      </div>
    </div>
  );
}