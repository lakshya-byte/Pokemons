import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./PokemonDetails.css";

function PokemonDetails() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchPokemon() {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!cancelled) {
          setPokemon({
            name: response.data.name,
            image: response.data.sprites.other.dream_world.front_default,
            weight: response.data.weight,
            height: response.data.height,
            types: response.data.types.map((t) => t.type.name),
          });
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch pokemon", error);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchPokemon();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Focus trap and initial focus
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const firstFocusable = modal.querySelectorAll(focusableElements)[0];
    if (firstFocusable) firstFocusable.focus();

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        // Request parent to close by blurring; parent may listen for blur or escape on the modal
        modal.blur();
      }
      if (e.key === "Tab") {
        const focusables = modal.querySelectorAll(focusableElements);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    modal.addEventListener("keydown", handleKeyDown);
    return () => {
      modal.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pokemon-details-title"
        aria-describedby="pokemon-details-description"
      >
        <div className="pokemon-details-wrapper" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", color: "#4a5568", padding: "20px" }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pokemon-details-title"
      aria-describedby="pokemon-details-description"
      tabIndex="-1"
      ref={modalRef}
    >
      <div className="pokemon-details-wrapper">
        <div className="pokemon-details-name">
          <h2 id="pokemon-details-title">Name: {pokemon?.name}</h2>
        </div>
        <div className="pokemon-details-image">
          <img src={pokemon?.image} alt={pokemon?.name} />
        </div>
        <div>
          <div>
            <h3>Weight: {pokemon?.weight}</h3>
          </div>
          <div>
            <h3>Height: {pokemon?.height}</h3>
          </div>
        </div>
        <div className="pokemon-details-types" id="pokemon-details-description">
          {pokemon?.types?.map((t) => (
            <div key={t}>
              {t.type ? t.type.name : t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PokemonDetails;