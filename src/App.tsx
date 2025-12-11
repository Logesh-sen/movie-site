import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Slideshow from "./pages/Slideshow";
import AppNavbar from "./components/Navbar";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppNavbar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
      />
      <Routes>
        <Route 
          path="/" 
          element={<Home searchQuery={searchQuery} />} 
        />
        <Route 
          path="/favorites" 
          element={<Favorites />} 
        />
        <Route 
          path="/slideshow" 
          element={<Slideshow />} 
        />
      </Routes>
    </div>
  );
}

export default App;
