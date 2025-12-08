import { useState } from "react";
import "../App.css";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

interface AppNavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const navLinks = ["Home", "Movies", "About"];

export default function AppNavbar({ searchQuery, setSearchQuery }: AppNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const SearchInput = ({ className = "" }: { className?: string }) => (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="!pl-12 border-2 border-border"
      />
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b-4 border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center text-xl sm:text-2xl font-bold text-primary hover:text-primary/80 transition-colors shrink-0">
          <img src="/logo.png" alt="CineVault logo" className="h-8 sm:h-10 mr-3" />
          <span>CineVault</span>
        </a>

        <div className="hidden md:flex items-center gap-4 sm:gap-6 md:gap-8">
          {navLinks.map((link) => (
            <a key={link} href="#" className="nav-link">{link}</a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <SearchInput className="flex-1 max-w-md hidden md:block" />
          <AnimatedThemeToggler />
          <button className="md:hidden flex flex-col gap-1.5 w-8 h-8 justify-center items-center" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`hamburger-line ${isMenuOpen ? (i === 0 ? "rotate-45 translate-y-2.5" : i === 1 ? "opacity-0" : "-rotate-45 -translate-y-2.5") : ""}`} />
            ))}
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="px-4 py-3 border-b-2 border-border">
          <SearchInput />
        </div>
        {navLinks.map((link) => (
          <a key={link} href="#" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>{link}</a>
        ))}
      </div>
    </nav>
  );
}
