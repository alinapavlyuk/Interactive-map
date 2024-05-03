export interface IMarker {
  title: string;
  type: string;
  position: {
    lat: number;
    lng: number;
  };
  id: string;
}
