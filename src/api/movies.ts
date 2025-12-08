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
}

export async function fetchMovies(page: number): Promise<MoviesResponse> {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-India&page=${page}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  return res.json();
}

export async function searchMovies(
  query: string,
  page: number
): Promise<MoviesResponse> {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-India&query=${encodeURIComponent(query)}&page=${page}`
  );

  if (!res.ok) {
    throw new Error("Failed to search movies");
  }

  return res.json();
}
