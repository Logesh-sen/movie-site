export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview?: string;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  backdrop_path?: string;
  popularity?: number;
}

export interface MoviesResponse {
  results: Movie[];
  total_pages: number;
  page: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface GenresResponse {
  genres: Genre[];
}

export async function fetchMovies(page: number): Promise<MoviesResponse> {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  
  if (!API_KEY) {
    throw new Error("TMDb API key is not configured. Please check your .env file.");
  }
  
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data = await res.json();
  
  const moviesPerPage = 9;
  const startIndex = 0;
  const endIndex = moviesPerPage;
  const pageMovies = data.results.slice(startIndex, endIndex);
  
  return {
    ...data,
    results: pageMovies
  };
}

export async function searchMovies(
  query: string,
  page: number
): Promise<MoviesResponse> {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  
  if (!API_KEY) {
    throw new Error("TMDb API key is not configured. Please check your .env file.");
  }
  
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`;
  
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to search movies");
  }

  const data = await res.json();
  
  // Return exactly 9 movies per page
  const moviesPerPage = 9;
  const startIndex = 0;
  const endIndex = moviesPerPage;
  const pageMovies = data.results.slice(startIndex, endIndex);
  
  return {
    ...data,
    results: pageMovies
  };
}

export async function fetchMoviesByGenre(
  genreId: number,
  page: number
): Promise<MoviesResponse> {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  
  if (!API_KEY) {
    throw new Error("TMDb API key is not configured. Please check your .env file.");
  }
  
  try {
    // Try the discover endpoint first
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`;
    console.log('Fetching movies by genre:', { genreId, page, url });
    
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Genre API request failed:', res.status, res.statusText);
      throw new Error(`Failed to fetch movies by genre: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log('Genre API response:', data);
    console.log('Number of movies returned:', data.results?.length);
    
    // Return exactly 9 movies per page
    const moviesPerPage = 9;
    const startIndex = 0;
    const endIndex = moviesPerPage;
    const pageMovies = data.results.slice(startIndex, endIndex);
    
    console.log('Returning genre movies:', pageMovies);
    
    return {
      ...data,
      results: pageMovies
    };
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    
    // Fallback: If genre filtering fails, return popular movies
    console.log('Falling back to popular movies due to genre API failure');
    return fetchMovies(page);
  }
}

export async function getMovieDetails(movieId: number): Promise<Movie> {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  
  if (!API_KEY) {
    throw new Error("TMDb API key is not configured. Please check your .env file.");
  }
  
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch movie details");
  }

  return res.json();
}

export async function fetchGenres(): Promise<GenresResponse> {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  
  if (!API_KEY) {
    throw new Error("TMDb API key is not configured. Please check your .env file.");
  }
  
  const res = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch genres");
  }

  return res.json();
}