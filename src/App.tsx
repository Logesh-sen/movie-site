import { useState } from "react";
import MovieCatalogue from "./components/MovieCatalogue";
import AppNavbar from "./components/Navbar";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppNavbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <MovieCatalogue searchQuery={searchQuery} />
    </div>
  );
}

export default App;
