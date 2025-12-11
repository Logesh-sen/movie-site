import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMovies, searchMovies, fetchMoviesByGenre, type Movie, type MoviesResponse } from "../api/movies";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../components/ui/pagination";
import GenreFilter from "../components/GenreFilter";
import MovieGrid from "../components/MovieGrid";
import MovieDetailsModal from "../components/MovieDetailsModal";
import MovieSlideshow from "../components/MovieSlideshow";
import { useFavorites } from "../hooks/useFavorites";
import { HyperText } from "@/components/ui/hyper-text"

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

  useEffect(() => setPage(1), [debouncedSearchQuery, selectedGenre]);

  const { data, isPending, isError } = useQuery<MoviesResponse>({
    queryKey: ["movies", page, debouncedSearchQuery, selectedGenre],
    queryFn: () => {
      if (debouncedSearchQuery.trim().length >= 2) return searchMovies(debouncedSearchQuery.trim(), page);
      if (selectedGenre > 0) return fetchMoviesByGenre(selectedGenre, page);
      return fetchMovies(page);
    },
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });

  if (isPending) return <div className="flex justify-center items-center min-h-screen"><p className="text-lg">Loading movies…</p></div>;
  if (isError) return <div className="flex justify-center items-center min-h-screen"><p className="text-lg text-destructive">Error fetching movies.</p></div>;

  const allMovies = data?.results || [];
  const movies = allMovies.slice(0, 9);
  const totalPages = data?.total_pages || 1;

  if (debouncedSearchQuery.trim().length >= 2 && movies.length === 0) {
    return (
      <div className="min-h-screen py-6 px-4">
        <div className="max-w-7xl mx-auto flex justify-center items-center min-h-[400px]">
          <p className="text-lg text-muted-foreground">No movies found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {!debouncedSearchQuery.trim() && movies.length > 0 && (
          <div className="mb-8">
            <MovieSlideshow movies={movies.slice(0, 5)}/>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">
            <HyperText>
              {debouncedSearchQuery.trim() ? `Result: "${debouncedSearchQuery}"` : "Popular Movies"}
            </HyperText>
          </h2>
          {!debouncedSearchQuery.trim() && (
            <GenreFilter selectedGenre={selectedGenre} onGenreChange={setSelectedGenre} />
          )}
        </div>

        <MovieGrid movies={movies} favorites={favorites} onToggleFavorite={toggleFavorite} onMovieClick={setSelectedMovie} />

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    if (page > 1) setPage(page - 1); 
                  }}
                  className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              <PaginationItem>
                <PaginationLink 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setPage(1); }} 
                  isActive={page === 1}
                >
                  1
                </PaginationLink>
              </PaginationItem>

              {page > 3 && totalPages > 5 && (
                <PaginationItem>
                  <span className="px-3 py-2">...</span>
                </PaginationItem>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(pageNum => {
                  if (pageNum === 1 || pageNum === totalPages) return false;
                  return Math.abs(pageNum - page) <= 1;
                })
                .map(pageNum => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); setPage(pageNum); }} 
                      isActive={page === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}

              {page < totalPages - 2 && totalPages > 5 && (
                <PaginationItem>
                  <span className="px-3 py-2">...</span>
                </PaginationItem>
              )}

              {totalPages > 1 && (
                <PaginationItem>
                  <PaginationLink 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); setPage(totalPages); }} 
                    isActive={page === totalPages}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    if (page < totalPages) setPage(page + 1); 
                  }}
                  className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        <MovieDetailsModal movie={selectedMovie} isOpen={!!selectedMovie} onClose={() => setSelectedMovie(null)} />
      </div>
    </div>
  );
}