import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Pokemon from "../Pokemon/Pokemon";

function PokemonList() {
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [POKEDEX_URL, setPOKEDEX_URL] = useState("https://pokeapi.co/api/v2/pokemon");
  const [nexturl, setNexturl] = useState('');
  const [prevurl, setPrevUrl] = useState('');
  const listboxRef = useRef(null);
  const optionRefs = useRef([]);

  const downloadPokemons = useCallback(async () => {
    const response = await axios.get(POKEDEX_URL);

    const pokemonResults = response.data.results;

    setNexturl(response.data.next)
    setPrevUrl(response.data.previous)

    const pokemonResultPromise = pokemonResults.map((pokemon) =>
      axios.get(pokemon.url)
    );

    const pokemonData = await axios.all(pokemonResultPromise);

    const res = pokemonData.map((pokedata) => {
      const pokemon = pokedata.data;
      return {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.sprites.other
          ? pokemon.sprites.other.dream_world.front_default
          : pokemon.sprites.front_default,
        types: pokemon.types,
      };
    });

    setPokemonList(res);
    setIsLoading(false);
  }, [POKEDEX_URL]);

  useEffect(() => {
    downloadPokemons();
  }, [downloadPokemons]);

  const handleKeyDown = (e) => {
    if (listboxRef.current === null) return;
    const options = optionRefs.current.filter(Boolean);
    if (options.length === 0) return;
    let index = options.findIndex(opt => opt === document.activeElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (index + 1) % options.length;
      options[nextIndex].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (index - 1 + options.length) % options.length;
      options[prevIndex].focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      // Optionally trigger selection; for now just alert
      if (index >= 0) {
        alert(`Selected: ${pokemonList[index].name}`);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      listboxRef.current.blur();
    }
  };

  return (
    <>
      <style>
        {`
          :root {
            --spacing-xs: 4px;
            --spacing-sm: 8px;
            --spacing-md: 16px;
            --spacing-lg: 24px;
            --spacing-xl: 32px;
            --color-bg: #f5f7fa;
            --color-surface: #ffffff;
            --color-primary: #6c63ff;
            --color-primary-dark: #5b52e6;
            --color-text: #222222;
            --color-text-muted: #444444;
            --color-disabled: #dddddd;
            --color-shadow: rgba(0, 0, 0, 0.1);
            --radius-sm: 8px;
            --radius-md: 10px;
            --radius-lg: 25px;
            --transition-fast: 0.2s ease;
            --transition-normal: 0.3s ease;
          }
          .pokemon-list-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: var(--spacing-lg);
            background-color: var(--color-bg);
            min-height: 100vh;
            font-family: 'Arial', sans-serif;
          }
          h3 {
            font-size: 2rem;
            color: var(--color-text);
            margin-bottom: var(--spacing-md);
            font-weight: bold;
          }
          .pokemon-wrapper {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: var(--spacing-md);
            width: 100%;
            max-width: 1200px;
          }
          .controls {
            margin-top: var(--spacing-md);
            display: flex;
            gap: var(--spacing-sm);
          }
          .controls button {
            background-color: var(--color-primary);
            color: white;
            border: none;
            padding: var(--spacing-xs) var(--spacing-md);
            font-size: 1rem;
            border-radius: var(--radius-lg);
            cursor: pointer;
            transition: background-color var(--transition-normal);
          }
          .controls button:hover {
            background-color: var(--color-primary-dark);
          }
          .controls button:disabled {
            background-color: var(--color-disabled);
            cursor: not-allowed;
          }
          /* Focus visible for keyboard navigation */
          .controls button:focus-visible,
          .pokemon-option:focus-visible {
            outline: 2px solid var(--color-primary);
            outline-offset: 2px;
          }
          .pokemon-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: var(--color-surface);
            border-radius: var(--radius-md);
            box-shadow: 0 4px 8px var(--color-shadow);
            padding: var(--spacing-sm);
            transition: transform var(--transition-normal);
          }
          .pokemon-card:hover {
            transform: scale(1.05);
          }
          .pokemon-card img {
            width: 120px;
            height: 120px;
            object-fit: cover;
            margin-bottom: var(--spacing-xs);
          }
          .pokemon-card h4 {
            font-size: 1.2rem;
            color: var(--color-text-muted);
            margin: var(--spacing-xs) 0;
            text-transform: capitalize;
          }
          @media (max-width: 768px) {
            .pokemon-wrapper {
              grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            }
            .controls button {
              padding: var(--spacing-xs) var(--spacing-sm);
            }
          }
        `}
      </style>
      <div className="pokemon-list-wrapper">
        <h3>Pokemon List</h3>
        <div
          className="pokemon-wrapper"
          role="listbox"
          tabIndex={0}
          ref={listboxRef}
          onKeyDown={handleKeyDown}
        >
          {isLoading
            ? "Loading..."
            : pokemonList.map((p, idx) => {
                const refCallback = (node) => {
                  optionRefs.current[idx] = node;
                };
                return (
                  <div
                    key={p.id}
                    role="option"
                    aria-selected={false}
                    tabIndex={-1}
                    ref={refCallback}
                    className="pokemon-option"
                  >
                    <Pokemon name={p.name} image={p.image} key={p.id} id={p.id} />
                  </div>
                );
              })}
        </div>
        <div className="controls">
          <button disabled={prevurl===undefined} onClick={()=>{setPOKEDEX_URL(prevurl)}} >Prev</button>
          <button disabled={nexturl===undefined} onClick={()=>{setPOKEDEX_URL(nexturl)}} >Next</button>
        </div>
      </div>
    </>
  );
}

export default PokemonList;