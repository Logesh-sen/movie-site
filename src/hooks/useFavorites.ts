import { useState, useEffect } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('movieFavorites');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('movieFavorites', JSON.stringify([...favorites]));
    } catch {}
  }, [favorites]);

  const toggleFavorite = (movieId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(movieId) ? next.delete(movieId) : next.add(movieId);
      return next;
    });
  };

  return { favorites, toggleFavorite };
}