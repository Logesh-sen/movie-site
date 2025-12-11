import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, Heart, Maximize2, Volume2, VolumeX } from "lucide-react";
import { type Movie } from "../api/movies";
import { Button } from "@/components/ui/button";

interface AdvancedMovieSlideshowProps {
  movies: Movie[];
  autoPlayInterval?: number;
  showThumbnails?: boolean;
  enableFullscreen?: boolean;
  isFavorite?: (movieId: number) => boolean;
  onToggleFavorite?: (movieId: number, e?: React.MouseEvent) => void;
  onMovieClick?: (movie: Movie) => void;
}

export default function AdvancedMovieSlideshow({ 
  movies, 
  autoPlayInterval = 5000,
  showThumbnails = true,
  enableFullscreen = true,
  isFavorite,
  onToggleFavorite,
  onMovieClick
}: AdvancedMovieSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const slideshowRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | undefined>(undefined);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === movies.length - 1 ? 0 : prevIndex + 1
    );
  }, [movies.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  }, [movies.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = async () => {
    if (!enableFullscreen || !slideshowRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await slideshowRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isFullscreen) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    if (!isPlaying || movies.length <= 1) return;

    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isPlaying, nextSlide, autoPlayInterval, movies.length]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          prevSlide();
          break;
        case 'ArrowRight':
          nextSlide();
          break;
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'Escape':
          if (isFullscreen) {
            document.exitFullscreen();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [prevSlide, nextSlide, isFullscreen]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [movies]);

  if (!movies.length) {
    return (
      <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No movies to display</p>
      </div>
    );
  }

  const currentMovie = movies[currentIndex];

  return (
    <div 
      ref={slideshowRef}
      className={`relative w-full rounded-lg overflow-hidden group ${
        isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'h-96 md:h-[600px]'
      }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => !isFullscreen && setShowControls(true)}
    >
      <div className="relative w-full h-full">
        {currentMovie.backdrop_path ? (
          <img
            src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
            alt={currentMovie.title}
            className="w-full h-full object-cover transition-transform duration-1000"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-2">{currentMovie.title}</h3>
              <p className="text-muted-foreground">No backdrop available</p>
            </div>
          </div>
        )}
        
        <div className="slideshow-overlay absolute inset-0" />
        
        <div className={`absolute bottom-0 left-0 right-0 p-6 text-white transition-opacity duration-300 ${
          showControls || !isFullscreen ? 'opacity-100' : 'opacity-0'
        }`}>
          <h2 className={`font-bold mb-2 line-clamp-2 ${
            isFullscreen ? 'text-3xl md:text-5xl' : 'text-2xl md:text-4xl'
          }`}>
            {currentMovie.title}
          </h2>
          {currentMovie.overview && (
            <p className={`text-gray-200 line-clamp-3 mb-4 ${
              isFullscreen ? 'text-lg max-w-4xl' : 'text-sm md:text-base max-w-2xl'
            }`}>
              {currentMovie.overview}
            </p>
          )}
          <div className="flex items-center gap-4">
            {currentMovie.release_date && (
              <span className="text-sm text-gray-300">
                {new Date(currentMovie.release_date).getFullYear()}
              </span>
            )}
            {currentMovie.vote_average && (
              <span className="text-sm text-gray-300 flex items-center gap-1">
                ⭐ {currentMovie.vote_average.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </div>

      {movies.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className={`slideshow-control absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white transition-all duration-300 ${
              showControls || !isFullscreen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={prevSlide}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={`slideshow-control absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white transition-all duration-300 ${
              showControls || !isFullscreen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={nextSlide}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      <div className={`absolute top-4 right-4 flex gap-2 transition-opacity duration-300 ${
        showControls || !isFullscreen ? 'opacity-100' : 'opacity-0'
      }`}>
        {movies.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            className="slideshow-control bg-black/50 hover:bg-black/70 text-white"
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="slideshow-control bg-black/50 hover:bg-black/70 text-white"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
        
        {enableFullscreen && (
          <Button
            variant="ghost"
            size="icon"
            className="slideshow-control bg-black/50 hover:bg-black/70 text-white"
            onClick={toggleFullscreen}
          >
            <Maximize2 className="w-5 h-5" />
          </Button>
        )}
        
        {onToggleFavorite && isFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className="slideshow-control bg-black/50 hover:bg-black/70 text-white"
            onClick={(e) => onToggleFavorite(currentMovie.id, e)}
          >
            <Heart 
              className={`w-5 h-5 ${
                isFavorite(currentMovie.id) 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-white'
              }`}
            />
          </Button>
        )}
      </div>

      {movies.length > 1 && (
        <div className={`absolute ${
          showThumbnails ? 'bottom-24' : 'bottom-20'
        } left-1/2 -translate-x-1/2 flex gap-2 transition-opacity duration-300 ${
          showControls || !isFullscreen ? 'opacity-100' : 'opacity-0'
        }`}>
          {movies.map((_, index) => (
            <button
              key={index}
              className={`slideshow-indicator w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}

      {showThumbnails && movies.length > 1 && !isFullscreen && (
        <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/50 rounded-lg transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}>
          {movies.slice(0, 7).map((movie, index) => (
            <button
              key={movie.id}
              className={`relative w-16 h-10 rounded overflow-hidden transition-all duration-300 ${
                index === currentIndex 
                  ? 'ring-2 ring-white scale-110' 
                  : 'hover:scale-105 opacity-70 hover:opacity-100'
              }`}
              onClick={() => goToSlide(index)}
            >
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">N/A</span>
                </div>
              )}
            </button>
          ))}
          {movies.length > 7 && (
            <div className="flex items-center px-2 text-white text-sm">
              +{movies.length - 7}
            </div>
          )}
        </div>
      )}

      {onMovieClick && (
        <button
          className="absolute inset-0 w-full h-full cursor-pointer z-10"
          onClick={() => onMovieClick(currentMovie)}
          aria-label={`View details for ${currentMovie.title}`}
        />
      )}

      {isFullscreen && (
        <div className={`absolute top-4 left-4 text-white text-sm bg-black/50 p-2 rounded transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}>
          <div>← → Navigate | Space Play/Pause | F Fullscreen | Esc Exit</div>
        </div>
      )}
    </div>
  );
}