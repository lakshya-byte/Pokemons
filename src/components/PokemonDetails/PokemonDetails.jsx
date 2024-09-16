import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./PokemonDetails.css";

function PokemonDetails() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState({});

  async function downloadPokemon() {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    console.log(response.data);

    setPokemon({
      name: response.data.name,
      image: response.data.sprites.other.dream_world.front_default,
      weight: response.data.weight,
      height: response.data.height,
      types: response.data.types.map((t) => {
        t.type.name;
      }),
    });
  }

  useEffect(() => {
    downloadPokemon();
  }, []);

  return (
    <div className="pokemon-details-wrapper">
      <div className="pokemon-details-name">
        <h2>name:{pokemon.name}</h2>
      </div>
      <div className="pokemon-details-image">
        <img src={pokemon.image} alt="" />
      </div>
      <div>
        <div>
          <h3>weight:{pokemon.weight}</h3>
        </div>
        <div>
          <h3>height:{pokemon.height}</h3>
        </div>
      </div>
      <div className="pokemon-details-types">
         {pokemon && pokemon.types?.map((t)=><div key={t}>{t}</div>)}
      </div>
    </div>
  );
}

export default PokemonDetails;
