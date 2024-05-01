import "./App.css";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import MapPageContainer from "./pages/Map/MapPageContainer.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/map?mode=view" />}></Route>
        <Route path="/map" element={<MapPageContainer />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
