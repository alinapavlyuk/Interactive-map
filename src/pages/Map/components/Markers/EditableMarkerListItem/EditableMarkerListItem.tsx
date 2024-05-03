import { IMarker } from "../../../../../types/IMarker.ts";
import "./editableMarkerListItem.css";
import { markerTypes } from "../../../../../constants/markerTypes.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

type MarkerItemProps = {
  marker: IMarker;
  onChangeTitle: (marker: IMarker, newTitle: string) => void;
  onChangeType: (marker: IMarker, newType: string) => void;
  onDeleteMarker: (marker: IMarker) => void;
  onSelectMarker: (lat: number, lng: number) => void;
};

export default function EditableMarkerListItem({
  marker,
  onChangeTitle,
  onChangeType,
  onDeleteMarker,
  onSelectMarker,
}: MarkerItemProps) {
  const { title, type, position } = marker;

  return (
    type !== "current" && (
      <li className="marker-list-item editable">
        <input
          className="marker-title-input"
          name="title"
          value={title}
          onChange={(event) => {
            onChangeTitle(marker, event.target.value);
          }}
          onClick={() => {
            onSelectMarker(position.lat, position.lng);
          }}
        />
        <select
          className="marker-type-select"
          name="type"
          value={type}
          onChange={(event) => {
            onChangeType(marker, event.target.value);
          }}
          onClick={() => {
            onSelectMarker(position.lat, position.lng);
          }}
        >
          {markerTypes.map((markerType) => {
            return (
              <option key={markerType} value={markerType}>
                {markerType}
              </option>
            );
          })}
        </select>
        <button
          className="marker-button"
          onClick={() => {
            onDeleteMarker(marker);
          }}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </li>
    )
  );
}
