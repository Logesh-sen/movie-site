import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGenres } from "../api/movies";
import { ChevronDown } from "lucide-react";

interface GenreFilterProps {
  selectedGenre: number;
  onGenreChange: (genreId: number) => void;
}

export default function GenreFilter({ selectedGenre, onGenreChange }: GenreFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
    staleTime: 24 * 60 * 60 * 1000,
  });

  const genres = [{ id: 0, name: "All Genres" }, ...(data?.genres || [])];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-card border-2 border-border rounded-lg hover:border-primary transition-all min-w-[160px] justify-between"
      >
        <span className="text-sm font-medium">{genres.find(g => g.id === selectedGenre)?.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-card border-2 border-border rounded-lg z-50 max-h-64 overflow-y-auto hide-scrollbar">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => { onGenreChange(genre.id); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${
                selectedGenre === genre.id ? 'bg-primary text-white' : ''
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