import MarkersList from "../MarkersList/MarkersList.tsx";
import Map from "../../../../components/Map/Map.tsx";
import { IMarker } from "../../../../types/IMarker.ts";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ActionButtons from "../ActionButtons/ActionButtons.tsx";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [centerPosition, setCenterPosition] = useState({
    lat: 0,
    lng: 0,
  });
  const [editedMarkers, setEditedMarkers] = useState<IMarker[]>(
    JSON.parse(JSON.stringify(markers)),
  );
  const [changesMade, setChangesMade] = useState(false);
  function handleSelectMarkerListItem(lat: number, lng: number) {
    setCenterPosition((prevCenter) => {
      if (prevCenter.lat !== lat && prevCenter.lng !== lng) {
        return { lat: lat, lng: lng };
      }
      return prevCenter;
    });
  }

  function handleSave() {
    navigate("/map?mode=view");
    setMarkers(JSON.parse(JSON.stringify(editedMarkers)));
    setChangesMade(false);
  }

  function handleCancel() {
    setEditedMarkers(JSON.parse(JSON.stringify(markers)));
    setChangesMade(false);
  }

  function handleAdd() {
    const newMarkerPosition = {
      lat: centerPosition.lat + 1,
      lng: centerPosition.lng + 1,
    };
    setEditedMarkers((prevMarkers) => {
      const newMarker = {
        title: "New Marker",
        position: newMarkerPosition,
        type: "green",
        id: `${Date.now().toString()}`,
      };
      return [...prevMarkers, newMarker];
    });
    setCenterPosition(newMarkerPosition);
    setChangesMade(true);
  }

  useEffect(() => {
    setEditedMarkers(JSON.parse(JSON.stringify(markers)));
  }, [markers]);

  // console.log("editedMarkers = markers ? ", editedMarkers === markers);
  useEffect(() => {
    return () => {
      console.log("DESTROY 111");
    };
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
              onAdd={handleAdd}
            />
          ) : null
        }
      />
    </>
  );
}
