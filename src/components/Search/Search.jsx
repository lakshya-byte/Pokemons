import "./Search.css";
import { useState, useEffect, useRef } from "react";

function Search() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  // Debounced search simulation
  useEffect(() => {
    clearTimeout(timeoutRef.current);
    setLoading(true);
    timeoutRef.current = setTimeout(() => {
      // Simulate search (e.g., fetch suggestions)
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeoutRef.current);
  }, [query]);

  return (
    <div className="search-wrapper">
      <label htmlFor="pokemon-name-search" className="search-label">
        Pokemon Name
      </label>
      <div aria-live="polite" className="search-live-region">
        {loading ? "Searching..." : ""}
      </div>
      <input
        type="text"
        id="pokemon-name-search"
        placeholder="Search a Pokemon..."
        aria-label="Search Pokemon name"
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          setLoading(true);
          clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => setLoading(false), 500);
        }}
        style={{
          width: '100%',
          minHeight: '44px',
          padding: '14px 24px',
          fontSize: '1.2rem',
        }}
      />
    </div>
  );
}

export default Search;