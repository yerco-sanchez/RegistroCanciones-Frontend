import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import CancionesPage from "./components/pages/CancionesPage";
import ArtistasPage from "./components/pages/ArtistasPage";
import GenerosPage from "./components/pages/GenerosPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CancionesPage />
    <ArtistasPage />
    <GenerosPage />
  </StrictMode>
);
