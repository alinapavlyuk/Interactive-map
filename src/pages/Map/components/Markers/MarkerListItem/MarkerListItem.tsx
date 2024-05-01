import { IMarker } from "../../../../../types/IMarker.ts";
import "./markerListItem.css";
import MarkerType from "../MarkerType/MarkerType.tsx";

type MarkerItemProps = {
  marker: IMarker;
  onSelectMarker: (latitude: number, longitude: number) => void;
};

export default function MarkerListItem({
  marker,
  onSelectMarker,
}: MarkerItemProps) {
  const { title, type, position } = marker;
  return (
    <li
      className="markerListItem"
      onClick={() => {
        onSelectMarker(position.latitude, position.longitude);
      }}
    >
      <h2>{title}</h2>
      <MarkerType type={type} />
    </li>
  );
}
