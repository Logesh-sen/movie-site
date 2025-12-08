import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchMovies, searchMovies, type Movie } from "../api/movies";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const CARDS_PER_PAGE = 12;

export default function MovieCatalogue({ searchQuery }: { searchQuery: string }) {
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => setPage(1), [searchQuery]);

  const { data, isPending, isError, isFetching } = useQuery({
    queryKey: ["movies", page, searchQuery],
    queryFn: () => searchQuery.trim() ? searchMovies(searchQuery.trim(), page) : fetchMovies(page),
    placeholderData: keepPreviousData,
  });

  const CenteredMessage = ({ children, error }: { children: React.ReactNode; error?: boolean }) => (
    <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
      <p className={`text-lg ${error ? "text-destructive" : ""}`}>{children}</p>
    </div>
  );

  if (isPending) return <CenteredMessage>Loading movies…</CenteredMessage>;
  if (isError) return <CenteredMessage error>Error fetching movies.</CenteredMessage>;

  const displayedMovies = data?.results.slice(0, CARDS_PER_PAGE) || [];

  const handlePageClick = (e: React.MouseEvent, newPage: number) => {
    e.preventDefault();
    setPage(newPage);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-6 sm:py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-1xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-center pb-3 sm:pb-4">
          {searchQuery.trim() ? `Search Results for "${searchQuery}"` : "Popular Movies"}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-8">
          {displayedMovies.map((movie) => (
            <div key={movie.id} className="bg-card border-2 border-border p-2 sm:p-3 md:p-4 transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none cursor-pointer" style={{ boxShadow: "var(--shadow-md)" }} onClick={() => setSelectedMovie(movie)}>
              <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} className="w-full aspect-[2/3] object-container border-2 border-border mb-2 sm:mb-3" />
              <h3 className="text-xs sm:text-sm font-bold text-card-foreground text-center line-clamp-2">{movie.title}</h3>
            </div>
          ))}
        </div>

        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={(e) => page > 1 && handlePageClick(e, page - 1)} className={page === 1 ? "pointer-events-none opacity-50" : ""} />
            </PaginationItem>
            {[...Array(Math.min(5, data?.total_pages || 1))].map((_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink href="#" onClick={(e) => handlePageClick(e, i + 1)} isActive={page === i + 1}>{i + 1}</PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={(e) => page < (data?.total_pages || 1) && handlePageClick(e, page + 1)} className={page === data?.total_pages ? "pointer-events-none opacity-50" : ""} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <Dialog open={!!selectedMovie} onOpenChange={() => setSelectedMovie(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto hide-scrollbar p-0 gap-0 border-4 border-border bg-card">
            {selectedMovie && (
              <div className="relative">
                <div className="relative h-64 sm:h-80 overflow-hidden">
                  <img src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path || selectedMovie.poster_path}`} alt={selectedMovie.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                </div>
                <div className="p-6 sm:p-8 space-y-6 bg-card text-card-foreground">
                  <div className="space-y-3">
                    <DialogHeader>
                      <DialogTitle className="text-3xl sm:text-4xl font-black leading-tight text-foreground">{selectedMovie.title}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-wrap items-center justify-between">
                      {selectedMovie.release_date && (
                        <div className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                          <span className="inline-block w-2 h-2 bg-primary rounded-full" />
                          Released: {new Date(selectedMovie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      )}
                      {selectedMovie.vote_average !== undefined && (
                        <div className="bg-primary text-white border-2 border-border px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold text-sm">
                          ⭐ {selectedMovie.vote_average.toFixed(1)}/10
                        </div>
                      )}
                    </div>
                  </div>
                  {selectedMovie.overview && (
                    <div className="space-y-3">
                      <h4 className="text-xl font-bold border-l-4 border-primary pl-3 text-foreground">Overview</h4>
                      <p className="text-base leading-relaxed text-muted-foreground">{selectedMovie.overview}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        {isFetching && <p className="text-center mt-4 text-muted-foreground">Loading…</p>}
      </div>
    </div>
  );
}
