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
  onSelectMarker: (latitude: number, longitude: number) => void;
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
      <li className="markerListItem editable">
        <input
          className="markerTitleInput"
          name="title"
          defaultValue={title}
          onChange={(event) => {
            onChangeTitle(marker, event.target.value);
          }}
          onClick={() => {
            onSelectMarker(position.latitude, position.longitude);
          }}
        />
        <select
          className="markerTypeSelect"
          name="type"
          defaultValue={type}
          onChange={(event) => {
            onChangeType(marker, event.target.value);
          }}
          onClick={() => {
            onSelectMarker(position.latitude, position.longitude);
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
          className="markerButton"
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
