import { Link } from "react-router-dom";
import "./Pokemon.css";
import { useState } from "react";

function Pokemon({ name, image, id }) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div
      className={`pokemon ${isFocused ? "focus-visible" : ""}`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
      style={{ margin: "1rem" }}
    >
      <Link to={`/pokemon/${id}`}>
        <div className="pokemon-name">{name}</div>
        <div>
          <img
            className="pokemon-image"
            src={image}
            alt={`${name} image`}
            style={{ width: "100%", height: "auto", maxWidth: "150px", aspectRatio: "1 / 1" }}
          />
        </div>
      </Link>
    </div>
  );
}

export default Pokemon;