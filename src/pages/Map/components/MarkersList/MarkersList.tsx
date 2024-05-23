import MarkerListItem from "../Markers/MarkerListItem/MarkerListItem.tsx";
import EditableMarkerListItem from "../Markers/EditableMarkerListItem/EditableMarkerListItem.tsx";
import { IMarker } from "../../../../types/IMarker.ts";
import "./markersList.css";
import { ReactElement } from "react";

type MapViewProps = {
  mode: string | null;
  markers: IMarker[];
  onSelectMarker: (lat: number, lng: number) => void;
  recordMarkerChange: (marker: IMarker) => void;
  recordMarkerDelete: (markerId: number) => void;
  ActionButtons: ReactElement | null;
};

export default function MarkersList({
  mode,
  markers,
  onSelectMarker,
  recordMarkerChange,
  recordMarkerDelete,
  ActionButtons,
}: MapViewProps) {
  function handleTitleChange(marker: IMarker, newTitle: string) {
    recordMarkerChange({ ...marker, title: newTitle });
  }

  function handleTypeChange(marker: IMarker, newType: string) {
    recordMarkerChange({ ...marker, type: newType });
  }

  function handleMarkerDelete(marker: IMarker) {
    recordMarkerDelete(marker.id);
  }

  return (
    <div className="markers">
      {ActionButtons}
      {markers.length > 0 ? (
        <ul className="markers-list" id="list">
          {markers.map((marker) => {
            if (mode == "view") {
              return (
                <MarkerListItem
                  key={marker.id}
                  marker={marker}
                  onSelectMarker={onSelectMarker}
                />
              );
            } else if (mode == "manage") {
              return (
                <EditableMarkerListItem
                  key={marker.id}
                  marker={marker}
                  onChangeTitle={handleTitleChange}
                  onChangeType={handleTypeChange}
                  onDeleteMarker={handleMarkerDelete}
                  onSelectMarker={onSelectMarker}
                />
              );
            } else {
              return <span>Page mode problem.</span>;
            }
          })}
        </ul>
      ) : (
        <span id="markers-no-found-span">No markers found.</span>
      )}
    </div>
  );
}
