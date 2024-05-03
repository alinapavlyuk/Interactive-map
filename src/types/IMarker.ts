export interface IMarker {
  title: string;
  type: string;
  position: {
    latitude: number;
    longitude: number;
  };
  id: string;
}
