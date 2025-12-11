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
  genres?: Genre[];
  videos?: {
    results: Video[];
  };
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
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

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

async function fetchFromAPI(url: string): Promise<MoviesResponse> {
  if (!API_KEY) throw new Error("TMDb API key is not configured");
  
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  
  const data = await res.json();
  return data;
}

export async function fetchMovies(page: number): Promise<MoviesResponse> {
  return fetchFromAPI(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`);
}

export async function searchMovies(query: string, page: number): Promise<MoviesResponse> {
  return fetchFromAPI(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
}

export async function fetchMoviesByGenre(genreId: number, page: number): Promise<MoviesResponse> {
  try {
    return await fetchFromAPI(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`);
  } catch {
    return fetchMovies(page);
  }
}

export async function getMovieDetails(movieId: number): Promise<Movie> {
  if (!API_KEY) throw new Error("TMDb API key is not configured");
  const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos`);
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return res.json();
}

export async function fetchGenres(): Promise<GenresResponse> {
  if (!API_KEY) throw new Error("TMDb API key is not configured");
  const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to fetch genres");
  return res.json();
}