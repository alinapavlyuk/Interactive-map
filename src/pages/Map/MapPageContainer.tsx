import Layout from "../../components/Layout/Layout.tsx";
import { useSearchParams } from "react-router-dom";
import MapPageContent from "./components/MapPageContent/MapPageContent.tsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { IMarker } from "../../types/IMarker.ts";

export default function MapPageContainer() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const [markers, setMarkers] = useState<IMarker[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get("http://localhost:3001/markers")
      .then((response) => {
        setMarkers(response.data);
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error getting theme from API:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <Layout isLoading={isLoading}>
      <MapPageContent mode={mode}
                      markers={markers}
                      setMarkers={setMarkers}
      />
    </Layout>
  );
}
