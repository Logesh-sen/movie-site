import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetails, type Movie, type MoviesResponse } from "../api/movies";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Heart } from "lucide-react";
import MovieGrid from "../components/MovieGrid";
import MovieDetailsModal from "../components/MovieDetailsModal";
import { useFavorites } from "../hooks/useFavorites";

export default function Favorites() {
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => setPage(1), [favorites.size]);

  const { data: favoritesData, isPending: favoritesPending, isError: favoritesError } = useQuery<MoviesResponse>({
    queryKey: ["favorites", Array.from(favorites)],
    queryFn: async (): Promise<MoviesResponse> => {
      const favoriteIds = Array.from(favorites);
      if (favoriteIds.length === 0) {
        return { results: [], total_pages: 1, page: 1, total_results: 0 };
      }
      
      const favoriteMovies = await Promise.all(
        favoriteIds.map((id: number) => getMovieDetails(id))
      );
      
      const startIndex = (page - 1) * 9;
      const endIndex = startIndex + 9;
      const paginatedFavorites = favoriteMovies.slice(startIndex, endIndex);
      
      return {
        results: paginatedFavorites,
        total_pages: Math.ceil(favoriteMovies.length / 9),
        page: page,
        total_results: favoriteMovies.length
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });



  const CenteredMessage = ({ children, error }: { children: React.ReactNode; error?: boolean }) => (
    <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
      <p className={`text-lg ${error ? "text-destructive" : ""}`}>{children}</p>
    </div>
  );

  if (favoritesPending) return <CenteredMessage>Loading favorites…</CenteredMessage>;
  if (favoritesError) return <CenteredMessage error>Error loading favorites.</CenteredMessage>;

  const displayedMovies = favoritesData?.results || [];
  const totalPages = favoritesData?.total_pages || 1;

  if (favorites.size === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-1xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-center pb-3 sm:pb-4">
            My Favorites
          </h1>
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-2">No favorite movies yet</p>
              <p className="text-sm text-muted-foreground">Click the heart icon on movies to add them to your favorites</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handlePageClick = (e: React.MouseEvent, newPage: number) => {
    e.preventDefault();
    setPage(newPage);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-6 sm:py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8 pb-3 sm:pb-4">
          <h1 className="text-1xl sm:text-2xl md:text-3xl font-bold">
            My Favorites
          </h1>
        </div>

        <MovieGrid
          movies={displayedMovies}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onMovieClick={setSelectedMovie}
        />

        {totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" onClick={(e) => page > 1 && handlePageClick(e, page - 1)} className={page === 1 ? "pointer-events-none opacity-50" : ""} />
              </PaginationItem>
              {[...Array(Math.min(5, totalPages || 1))].map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink href="#" onClick={(e) => handlePageClick(e, i + 1)} isActive={page === i + 1}>{i + 1}</PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext href="#" onClick={(e) => page < totalPages && handlePageClick(e, page + 1)} className={page === totalPages ? "pointer-events-none opacity-50" : ""} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        <MovieDetailsModal
          movie={selectedMovie}
          isOpen={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      </div>
    </div>
  );
}