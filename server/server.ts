import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

const markers = [
  {
    title: "Home",
    position: {
      lng: 50.44866553935577,
      lat: 30.451962039067208,
    },
    type: "green",
  },
  {
    title: "Home2",
    position: {
      lng: 30.451962039067208,
      lat: 50.4486655393557,
    },
    type: "green",
  },
  {
    title: "Lviv",
    position: {
      lng: 24.0522208,
      lat: 49.8539136,
    },
    type: "green",
  },
];

app.get("/markers", (req, res) => {
  res.json(markers);
});

app.post("/markers", (req, res) => {
  const newMarker = req.body;
  markers.push(newMarker);
  res.json(newMarker);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
