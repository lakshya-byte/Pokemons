import Search from "../Search/Search";
import PokemonList from "../PokeboxList/PokemonList";
import './Pokedex.css'

function Pokedex() {
  return (
    <div className="pokedex-wrapper" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem',
      padding: '40px',
      overflowY: 'auto',
      scrollBehavior: 'smooth',
    }}>
     <h1 id="pokedex-heading">Pokedex</h1>
      <Search />
      <PokemonList/>
    </div>
  );
}

export default Pokedex;