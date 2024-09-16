import { useEffect, useState } from "react";
import axios from "axios";
import "./PokemonList.css";
import Pokemon from "../Pokemon/Pokemon";

function PokemonList() {
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [POKEDEX_URL,setPOKEDEX_URL ] =useState( "https://pokeapi.co/api/v2/pokemon")
  const [nexturl, setNexturl] = useState('')
  const [prevurl, setPrevUrl] = useState('')

  async function downloadPokemons() {
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
  }

  useEffect(() => {
    downloadPokemons();
  }, [POKEDEX_URL]);
  //   downloadPokemons();

  return (
    <div className="pokemon-list-wrapper">
      <h3>Pokemon List</h3>
      <div className="pokemon-wrapper">
        {isLoading
          ? "Loading..."
          : pokemonList.map((p) => (
              <Pokemon name={p.name} image={p.image} key={p.id} id={p.id}/>
            ))}
      </div>
      <div className="controls">
        <button disabled={prevurl==undefined} onClick={()=>{setPOKEDEX_URL(prevurl)}} >Prev</button>
        <button disabled={nexturl==undefined} onClick={()=>{setPOKEDEX_URL(nexturl)}} >Next</button>
      </div>
    </div>
  );
}

export default PokemonList;
