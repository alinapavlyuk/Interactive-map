import "./markerType.css";
import { markerTypesColors } from "../../../../../constants/markerTypes.ts";

type MarkerTypeProps = {
  type: string;
};

export default function MarkerType({ type }: MarkerTypeProps) {
  return (
    type !== "current" && (
      <div
        className="marker-type-container"
        style={{ backgroundColor: markerTypesColors[type] }}
      >
        <span
          className="marker-type"
          style={{ color: markerTypesColors[`dark${type}`] }}
        >
          {type}
        </span>
      </div>
    )
  );
}
