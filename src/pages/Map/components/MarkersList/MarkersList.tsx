import MarkerListItem from "../Markers/MarkerListItem/MarkerListItem.tsx";
import EditableMarkerListItem from "../Markers/EditableMarkerListItem/EditableMarkerListItem.tsx";
import { IMarker } from "../../../../types/IMarker.ts";
import "./markersList.css";
import { Dispatch, ReactElement, SetStateAction } from "react";

type MapViewProps = {
  mode: string | null;
  markers: IMarker[];
  onSelectMarker: (lat: number, lng: number) => void;
  setMarkers: Dispatch<SetStateAction<IMarker[]>>;
  setChangesMade: Dispatch<SetStateAction<boolean>>;
  ActionButtons: ReactElement | null;
};

export default function MarkersList({
  mode,
  markers,
  onSelectMarker,
  setMarkers,
  setChangesMade,
  ActionButtons,
}: MapViewProps) {
  function handleTitleChange(marker: IMarker, newTitle: string) {
    setMarkers((prevMarkers) => {
      return prevMarkers.map((prevMarker) => {
        if (prevMarker.id === marker.id) {
          return {
            ...prevMarker,
            title: newTitle,
          };
        }
        return prevMarker;
      });
    });
    setChangesMade(true);
  }

  function handleTypeChange(marker: IMarker, newType: string) {
    setMarkers((prevMarkers) => {
      return prevMarkers.map((prevMarker) => {
        if (prevMarker.id === marker.id) {
          return {
            ...prevMarker,
            type: newType,
          };
        }
        return prevMarker;
      });
    });
    setChangesMade(true);
  }

  function handleMarkerDelete(marker: IMarker) {
    setMarkers((prevMarkers) => {
      return prevMarkers.filter((prevMarker) => prevMarker.id !== marker.id);
    });
    setChangesMade(true);
  }

  return (
    <div className="markers">
      {ActionButtons}
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
    </div>
  );
}
