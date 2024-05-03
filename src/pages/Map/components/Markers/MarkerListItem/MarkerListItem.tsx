import { IMarker } from "../../../../../types/IMarker.ts";
import "./markerListItem.css";
import MarkerType from "../MarkerType/MarkerType.tsx";

type MarkerItemProps = {
  marker: IMarker;
  onSelectMarker: (lat: number, lng: number) => void;
};

export default function MarkerListItem({
  marker,
  onSelectMarker,
}: MarkerItemProps) {
  const { title, type, position } = marker;
  return (
    <li
      className="marker-list-item"
      onClick={() => {
        onSelectMarker(position.lat, position.lng);
      }}
    >
      <h2>{title}</h2>
      <MarkerType type={type} />
    </li>
  );
}
