import { useState, useEffect } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<number>>(() => {
    try {
      const savedFavorites = localStorage.getItem('movieFavorites');
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        return new Set(parsedFavorites);
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    }
    return new Set();
  });

  useEffect(() => {
    try {
      const favoritesArray = Array.from(favorites);
      localStorage.setItem('movieFavorites', JSON.stringify(favoritesArray));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites]);

  const toggleFavorite = (movieId: number, e: React.MouseEvent) => {
    e.stopPropagation(); 
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(movieId)) {
        newFavorites.delete(movieId);
      } else {
        newFavorites.add(movieId);
      }
      return newFavorites;
    });
  };

  return {
    favorites,
    toggleFavorite
  };
}