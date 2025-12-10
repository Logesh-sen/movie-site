import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGenres } from "../api/movies";
import { ChevronDown } from "lucide-react";

interface GenreFilterProps {
  selectedGenre: number;
  onGenreChange: (genreId: number) => void;
}

export default function GenreFilter({ selectedGenre, onGenreChange }: GenreFilterProps) {
  const [showGenreFilter, setShowGenreFilter] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: genresData } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });

  const genres = genresData?.genres || [];
  const allGenres = [{ id: 0, name: "All Genres" }, ...genres];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowGenreFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowGenreFilter(!showGenreFilter)}
        className="flex items-center gap-2 px-4 py-2 bg-card border-2 border-border rounded-lg hover:border-primary transition-colors min-w-[160px] justify-between"
      >
        <span className="text-sm font-medium">
          {allGenres.find(g => g.id === selectedGenre)?.name || "All Genres"}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${showGenreFilter ? 'rotate-180' : ''}`} />
      </button>
      
      {showGenreFilter && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-card border-2 border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {allGenres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => {
                onGenreChange(genre.id);
                setShowGenreFilter(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors first:rounded-t-md last:rounded-b-md ${
                selectedGenre === genre.id
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'text-card-foreground'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}