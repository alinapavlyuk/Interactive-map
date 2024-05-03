import MarkersList from "../MarkersList/MarkersList.tsx";
import Map from "../../../../components/Map/Map.tsx";
import { IMarker } from "../../../../types/IMarker.ts";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ActionButtons from "../ActionButtons/ActionButtons.tsx";

type MapPageContentProps = {
  mode: string | null;
  markers: IMarker[];
  setMarkers: Dispatch<SetStateAction<IMarker[]>>;
};

export default function MapPageContent({
  mode,
  markers,
  setMarkers,
}: MapPageContentProps) {
  const [centerPosition, setCenterPosition] = useState({ lat: 0, lng: 0 });
  const [editedMarkers, setEditedMarkers] = useState(
    JSON.parse(JSON.stringify(markers)),
  );
  const [changesMade, setChangesMade] = useState(false);
  function handleSelectMarkerListItem(latitude: number, longitude: number) {
    setCenterPosition((prevCenter) => {
      if (prevCenter.lat !== latitude && prevCenter.lng !== longitude) {
        return { lat: latitude, lng: longitude };
      }
      return prevCenter;
    });
  }

  function handleSave() {
    setMarkers(JSON.parse(JSON.stringify(editedMarkers)));
    setChangesMade(false);
  }

  function handleCancel() {
    setEditedMarkers(JSON.parse(JSON.stringify(markers)));
    setChangesMade(false);
  }

  useEffect(() => {
    setEditedMarkers(JSON.parse(JSON.stringify(markers)));
  }, [markers]);

  console.log('editedMarkers = markers ? ', editedMarkers === markers);
  useEffect(() => {
    return () => {
      console.log('DESTROY 111');
    }
  }, []);
  return (
    <>
      <Map
        mode={mode}
        markers={mode === "manage" ? editedMarkers : markers}
        setMarkers={setEditedMarkers}
        setChangesMade={setChangesMade}
        center={centerPosition}
        setCenterPosition={setCenterPosition}
      />
      <MarkersList
        mode={mode}
        markers={mode === "manage" ? editedMarkers : markers}
        setMarkers={setEditedMarkers}
        setChangesMade={setChangesMade}
        onSelectMarker={handleSelectMarkerListItem}
        ActionButtons={
          mode === "manage" ? (
            <ActionButtons
              isDisabled={!changesMade}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : null
        }
      />
    </>
  );
}
