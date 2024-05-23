import { markerTypesColors } from "../../../../constants/markerTypes.ts";
import "./colorFilter.css";
import { useState } from "react";

type ColorFilterProps = {
  colors: string[];
  onSelectColor: (type: string | null) => void;
};

export default function ColorFilter({
  colors,
  onSelectColor,
}: ColorFilterProps) {
  const [activeColor, setActiveColor] = useState<string | null>(null);

  const handleClick = (color: string) => {
    setActiveColor(color);
    onSelectColor(color);
  };

  const handleReset = () => {
    setActiveColor(null);
    onSelectColor(null);
  };

  return (
    <div id="filter">
      <span>Filter by:</span>
      {colors.map((color) => {
        return (
          <button
            key={color}
            className={`filter-button ${activeColor === color ? "active" : ""}`}
            style={{ backgroundColor: markerTypesColors[color] }}
            onClick={() => {
              handleClick(color);
            }}
          ></button>
        );
      })}
      <button
        id="filter-reset-button"
        disabled={activeColor === null}
        onClick={handleReset}
      >
        Reset
      </button>
    </div>
  );
}
