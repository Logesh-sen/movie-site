import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMovies, searchMovies, fetchMoviesByGenre, type Movie, type MoviesResponse } from "../api/movies";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import GenreFilter from "../components/GenreFilter";
import MovieGrid from "../components/MovieGrid";
import MovieDetailsModal from "../components/MovieDetailsModal";
import { useFavorites } from "../hooks/useFavorites";

interface HomeProps {
  searchQuery: string;
}

export default function Home({ searchQuery }: HomeProps) {
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [selectedGenre, setSelectedGenre] = useState(0);
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2 || searchQuery.length === 0) {
        setDebouncedSearchQuery(searchQuery);
      }
    }, 800); 

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => setPage(1), [debouncedSearchQuery]);
  useEffect(() => setPage(1), [selectedGenre]);

  const { data, isPending, isError, isFetching } = useQuery<MoviesResponse>({
    queryKey: ["movies", { page, searchQuery: debouncedSearchQuery, genre: selectedGenre }],
    queryFn: () => {
      if (debouncedSearchQuery.trim().length >= 2) {
        return searchMovies(debouncedSearchQuery.trim(), page);
      }
      
      if (selectedGenre > 0) {
        return fetchMoviesByGenre(selectedGenre, page);
      }
      
      return fetchMovies(page);
    },
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const CenteredMessage = ({ children, error }: { children: React.ReactNode; error?: boolean }) => (
    <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
      <p className={`text-lg ${error ? "text-destructive" : ""}`}>{children}</p>
    </div>
  );

  if (isPending) return <CenteredMessage>Loading movies…</CenteredMessage>;
  if (isError) return <CenteredMessage error>Error fetching movies.</CenteredMessage>;

  const displayedMovies = data?.results || [];
  const totalPages = data?.total_pages || 1;

  if (debouncedSearchQuery.trim().length >= 2 && displayedMovies.length === 0 && !isPending) {
    return (
      <div className="min-h-screen bg-background text-foreground py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-1xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-center pb-3 sm:pb-4">
            Search Results for "{debouncedSearchQuery}"
          </h1>
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <p className="text-lg text-muted-foreground mb-2">No movies found</p>
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
            {debouncedSearchQuery.trim() 
              ? `Search Results for "${debouncedSearchQuery}"` 
              : "Popular Movies"
            }
          </h1>

          {!debouncedSearchQuery.trim() && (
            <GenreFilter 
              selectedGenre={selectedGenre}
              onGenreChange={setSelectedGenre}
            />
          )}
        </div>

        <MovieGrid
          movies={displayedMovies}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onMovieClick={setSelectedMovie}
        />

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

        <MovieDetailsModal
          movie={selectedMovie}
          isOpen={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
        {isFetching && <p className="text-center mt-4 text-muted-foreground">Loading…</p>}
      </div>
    </div>
  );
}