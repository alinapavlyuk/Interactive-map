import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./mapStyles.css";
import { Oval } from "react-loader-spinner";
import { IMarker } from "../../types/IMarker";
import { markerTypesColors } from "../../constants/markerTypes";
import { defaultPosition } from "../../constants/defaultPosition.ts";

type MapProps = {
  mode: string | null;
  markers: IMarker[];
  center: {
    lat: number;
    lng: number;
  };
  setCenterPosition: Dispatch<SetStateAction<{ lat: number; lng: number }>>;
  setMarkers: Dispatch<SetStateAction<IMarker[]>>;
  setChangesMade: Dispatch<SetStateAction<boolean>>;
};

export default function Map({
  mode,
  markers,
  center,
  setCenterPosition,
  setMarkers,
  setChangesMade,
}: MapProps) {
  const [map, setMap] = useState<google.maps.Map | undefined>(undefined);
  const [advancedMarkers, setAdvancedMarkers] = useState<
    google.maps.marker.AdvancedMarkerElement[]
  >([]);

  async function fetchMarkerObjects() {
    const { AdvancedMarkerElement, PinElement } =
      (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;
    return { AdvancedMarkerElement, PinElement };
  }

  async function initMap(): Promise<void> {
    const { Map } = (await google.maps.importLibrary(
      "maps",
    )) as google.maps.MapsLibrary;

    setMap(
      new Map(document.getElementById("map") as HTMLElement, {
        center: center,
        zoom: 8,
        mapId: "9a7ed4bf75b2291c",
      }),
    );
  }

  async function getLocation(): Promise<void> {
    const main = document.querySelector("main");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenterPosition(currentPosition);
          // setMarkers((prevMarkers) => {
          //   if (
          //     !(prevMarkers.length > 0 && prevMarkers[0].type === "current")
          //   ) {
          //     const currentPositionMarker = {
          //       title: "Current position",
          //       type: "current",
          //       position: {
          //         latitude: currentPosition.lat,
          //         longitude: currentPosition.lng,
          //       },
          //       id: "0",
          //     };
          //     return [currentPositionMarker, ...prevMarkers];
          //   }
          //   return prevMarkers;
          // });
        },
        () => {
          setCenterPosition(defaultPosition);
        },
      );
    } else {
      main!.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  async function loadMarkers() {
    const { AdvancedMarkerElement, PinElement } = await fetchMarkerObjects();

    markers.forEach((marker) => {
      const pinBackground = new PinElement({
        background: markerTypesColors[marker.type],
        borderColor: markerTypesColors[`dark${marker.type}`],
        glyphColor: markerTypesColors[`dark${marker.type}`],
      });

      const newMarker = new AdvancedMarkerElement({
        map: map,
        position: {
          lat: marker.position.latitude,
          lng: marker.position.longitude,
        },
        title: marker.title,
        content: pinBackground.element,
      });

      // if (mode == "manage") {
      //   newMarker.gmpDraggable = true;
      //   newMarker.addListener("dragend", () => {
      //     const position = newMarker.position as google.maps.LatLng;
      //     newMarkerInfoWindow.close();
      //     newMarkerInfoWindow.setContent(
      //       `<span class='marker-label'>Pin dropped at: ${position.lat}, ${position.lng}</span>`,
      //     );
      //     newMarkerInfoWindow.open({ anchor: newMarker, map });
      //   });
      // }

      const newMarkerInfoWindow = new google.maps.InfoWindow({
        content: `<span class='marker-label'>${marker.title}</span>`,
        ariaLabel: `Information about ${marker.title}`,
      });

      newMarker.addListener("click", () => {
        newMarkerInfoWindow.open({
          anchor: newMarker,
          map,
        });
      });

      setAdvancedMarkers((prevAdvancedMarkers) => {
        return [...prevAdvancedMarkers, newMarker];
      });
    });
  }

  useEffect(() => {
    getLocation().then(() => {
      initMap().then(() => {
        loadMarkers().then(() => {});
      });
    });
  }, []);

  useEffect(() => {
    if (center && map) {
      map.setCenter(center);
    }
  }, [center, map]);

  useEffect(() => {
    setAdvancedMarkers((prevAdvancedMarkers) => {
      prevAdvancedMarkers.map((marker) => {
        marker.position = null;
        return marker;
      });
      return [];
    });
    loadMarkers().then(() => {});
  }, [markers]);

  useEffect(() => {
    if (mode === "manage") {
      setAdvancedMarkers((prevAdvancedMarkers) => {
        return prevAdvancedMarkers.map((marker) => {
          marker.gmpDraggable = true;
          marker.addListener("dragend", () => {
            console.log(marker.position as google.maps.LatLng);
            setChangesMade(true);
          });
          return marker;
        });
      });
    } else if (mode === "view") {
      setAdvancedMarkers((prevAdvancedMarkers) => {
        return prevAdvancedMarkers.map((marker) => {
          marker.gmpDraggable = false;
          return marker;
        });
      });
    }
  }, [mode]);

  return (
    <div id="map">
      <Oval
        visible={true}
        height="30"
        width="30"
        color="#242424"
        secondaryColor="#242424"
        ariaLabel="oval-loading"
        wrapperClass="spinner-wrapper"
      />
    </div>
  );
}
