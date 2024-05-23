import MarkersList from "../MarkersList/MarkersList.tsx";
import Map from "../../../../components/Map/Map.tsx";
import { IMarker } from "../../../../types/IMarker.ts";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ActionButtons from "../ActionButtons/ActionButtons.tsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ColorFilter from "../FilterButton/ColorFilter.tsx";
import { markerTypes } from "../../../../constants/markerTypes.ts";

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
  const [changes, setChanges] = useState<{
    added: IMarker[];
    edited: IMarker[];
    deleted: number[];
  }>({
    added: [],
    edited: [],
    deleted: [],
  });
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
    const savePromises: Promise<any>[] = [];

    changes.added.forEach((marker) => {
      savePromises.push(axios.post("http://localhost:3000/markers", marker));
    });

    changes.edited.forEach((marker) => {
      savePromises.push(
        axios.put(`http://localhost:3000/markers/${marker.id}`, marker),
      );
    });

    changes.deleted.forEach((markerId) => {
      savePromises.push(
        axios.delete(`http://localhost:3000/markers/${markerId}`),
      );
    });

    Promise.all(savePromises)
      .then(() => {
        alert("Changes saved successfully!");
        setMarkers(JSON.parse(JSON.stringify(editedMarkers)));
        setChanges({ added: [], edited: [], deleted: [] });
        setChangesMade(false);
        navigate("/map?mode=view");
      })
      .catch((error) => {
        console.error("Error saving changes:", error);
      });
  }

  function handleCancel() {
    setEditedMarkers(JSON.parse(JSON.stringify(markers)));
    setChanges({ added: [], edited: [], deleted: [] });
    setChangesMade(false);
  }

  function handleAddMarker() {
    const newMarkerPosition = {
      lat: centerPosition.lat + 1,
      lng: centerPosition.lng + 1,
    };
    const newMarker = {
      title: "New Marker",
      position: newMarkerPosition,
      type: "green",
      id: Date.now(),
    };
    setEditedMarkers((prevMarkers) => {
      return [...prevMarkers, newMarker];
    });
    setCenterPosition(newMarkerPosition);
    setChanges((prev) => ({ ...prev, added: [...prev.added, newMarker] }));
    setChangesMade(true);
  }

  function handleChangeMarker(changedMarker: IMarker) {
    setEditedMarkers((prevMarkers) => {
      return prevMarkers.map((prevMarker) => {
        if (prevMarker.id === changedMarker.id) {
          return changedMarker;
        }
        return prevMarker;
      });
    });
    setChanges((prev) => {
      const isAdded = prev.added.some(
        (marker) => marker.id === changedMarker.id,
      );
      const isEdited = prev.edited.some(
        (marker) => marker.id === changedMarker.id,
      );

      if (isAdded) {
        return {
          ...prev,
          added: prev.added.map((marker) =>
            marker.id === changedMarker.id ? changedMarker : marker,
          ),
        };
      }

      if (isEdited) {
        return {
          ...prev,
          edited: prev.edited.map((marker) =>
            marker.id === changedMarker.id ? changedMarker : marker,
          ),
        };
      }

      return {
        ...prev,
        edited: [...prev.edited, changedMarker],
      };
    });
    setChangesMade(true);
  }

  function handleDeleteMarker(markerId: number) {
    setMarkers((prevMarkers) => {
      return prevMarkers.filter((prevMarker) => prevMarker.id !== markerId);
    });
    setChanges((prev) => {
      const isAdded = prev.added.some((marker) => marker.id === markerId);

      if (isAdded) {
        return {
          ...prev,
          added: prev.added.filter((marker) => marker.id !== markerId),
        };
      }

      return {
        ...prev,
        deleted: [...prev.deleted, markerId],
        edited: prev.edited.filter((marker) => marker.id !== markerId),
      };
    });
    setChangesMade(true);
  }

  function handleColorFilter(type: string | null) {
    const url =
      type === null
        ? "http://localhost:3000/markers"
        : `http://localhost:3000/markers/${type}`;
    axios
      .get(url)
      .then((response) => {
        setMarkers(response.data);
      })
      .catch((error) => {
        console.error("Error getting theme from API:", error);
      });
  }

  useEffect(() => {
    setEditedMarkers(JSON.parse(JSON.stringify(markers)));
  }, [markers]);

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
        onSelectMarker={handleSelectMarkerListItem}
        recordMarkerChange={handleChangeMarker}
        recordMarkerDelete={handleDeleteMarker}
        ActionButtons={
          mode === "manage" ? (
            <ActionButtons
              isDisabled={!changesMade}
              onSave={handleSave}
              onCancel={handleCancel}
              onAdd={handleAddMarker}
            />
          ) : (
            <ColorFilter
              colors={markerTypes}
              onSelectColor={handleColorFilter}
            />
          )
        }
      />
    </>
  );
}
