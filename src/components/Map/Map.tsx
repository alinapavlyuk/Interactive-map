import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import "./mapStyles.css";
import { Oval } from "react-loader-spinner";
import { IMarker } from "../../types/IMarker";
import { markerTypesColors } from "../../constants/markerTypes";
import { defaultPosition } from "../../constants/defaultPosition.ts";
import { IPosition } from "../../types/IPosition.ts";

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
  // const [map, setMap] = useState<google.maps.Map | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const map = useRef<google.maps.Map | null>(null);
  const advancedMarkers = useRef<google.maps.marker.AdvancedMarkerElement[]>(
    [],
  );

  const AdvancedMarkerElementClass =
    useRef<typeof google.maps.marker.AdvancedMarkerElement>();
  const PinElementClass = useRef<typeof google.maps.marker.PinElement>();

  async function initMap(currentPosition: IPosition | null): Promise<void> {
    const { Map } = (await google.maps.importLibrary(
      "maps",
    )) as google.maps.MapsLibrary;
    const { AdvancedMarkerElement, PinElement } =
      (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;

    AdvancedMarkerElementClass.current = AdvancedMarkerElement;
    PinElementClass.current = PinElement;

    map.current = new Map(document.getElementById("map") as HTMLElement, {
      center: currentPosition || center,
      zoom: 8,
      mapId: "9a7ed4bf75b2291c",
    });

    return Promise.resolve();
  }

  async function getLocation(): Promise<IPosition | null> {
    const main = document.querySelector("main");

    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            const currentPosition = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setCenterPosition(currentPosition);

            resolve(currentPosition);
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
            resolve(defaultPosition);
          },
        );
      } else {
        main!.innerHTML = "Geolocation is not supported by this browser.";
        resolve(null);
      }
    });
  }

  const createMarker = (marker: IMarker) => {
    const pinBackground = new PinElementClass.current({
      background: markerTypesColors[marker.type],
      borderColor: markerTypesColors[`dark${marker.type}`],
      glyphColor: markerTypesColors[`dark${marker.type}`],
    });

    const mapMarker = new AdvancedMarkerElementClass.current({
      map: map.current,
      position: {
        lat: marker.position.latitude,
        lng: marker.position.longitude,
      },
      title: marker.title,
      content: pinBackground.element,
    });
    return mapMarker;
  };

  const visualiseCurrentPositionMarker = (currentPosition: {
    lat: number;
    lng: number;
  }) => {
    const currentPositionMarker = {
      title: "current position",
      position: {
        latitude: currentPosition.lat,
        longitude: currentPosition.lng,
      },
      type: "current",
      id: "-1",
    };
    createMarker(currentPositionMarker);
  };

  const visualiseMarkers = () => {
    markers.forEach((marker) => {
      const mapMarker = createMarker(marker);

      if (mode === "manage") {
        mapMarker.gmpDraggable = true;
        mapMarker.addListener("dragend", () => {
          setChangesMade(true);

          setMarkers(
            markers.map((editedMarker) => {
              if (editedMarker.id === marker.id) {
                return {
                  ...editedMarker,
                  position: {
                    longitude: mapMarker.position?.lng as number,
                    latitude: mapMarker.position?.lat as number,
                  },
                };
              }
              return editedMarker;
            }),
          );
        });
      }

      if (mode === "view") {
        mapMarker.gmpDraggable = false;
      }

      const newMarkerInfoWindow = new google.maps.InfoWindow({
        content: `<span class='marker-label'>${marker.title}</span>`,
        ariaLabel: `Information about ${marker.title}`,
      });

      mapMarker.addListener("click", () => {
        newMarkerInfoWindow.open({
          anchor: mapMarker,
          map: map.current,
        });
      });

      advancedMarkers.current = [...advancedMarkers.current, mapMarker];
    });
  };

  const removeMarkers = () => {
    advancedMarkers.current.forEach((marker) => {
      marker.position = null;
      return marker;
    });

    advancedMarkers.current = [];
  };

  useEffect(() => {
    getLocation().then((currentPosition: IPosition | null) => {
      return initMap(currentPosition)
        .then(() => {
          visualiseMarkers();
          if (currentPosition) {
            visualiseCurrentPositionMarker(currentPosition);
          }
          return Promise.resolve();
        })
        .then(() => {
          setIsLoading(false);
        });
    });
  }, []);

  useEffect(() => {
    if (center && map.current) {
      map.current?.setCenter(center);
    }
  }, [center, map]);

  useEffect(() => {
    if (!map.current || !advancedMarkers.current) {
      return;
    }
    removeMarkers();
    visualiseMarkers();
  }, [markers]);

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
