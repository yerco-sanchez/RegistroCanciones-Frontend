import { useState, useEffect } from "react";
import {
  getArtistas,
  deleteArtista,
  putArtista,
  postArtista,
} from "../../services/artistaService";
import type { Artista } from "../../types/models/Artista";
import Table from "../molecules/Table";
import TableHeader from "../molecules/TableHeader";
import ArtistaModal from "../molecules/ArtistaModal";

interface ArtistaDisplay {
  id: number;
  nombre: string;
  nacionalidad: string;
  fechaNacimiento: string;
}

const ArtistasPage: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedArtista, setSelectedArtista] = useState<Artista | null>(null);
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [artistasDisplay, setArtistasDisplay] = useState<ArtistaDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const artistasRes = await getArtistas();
        setArtistas(artistasRes.data);
      } catch (error) {
        console.error("Error cargando artistas:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  useEffect(() => {
    if (artistas.length > 0) {
      convertirDatos(artistas);
    }
  }, [artistas]);

  const convertirDatos = (artistas: Artista[]) => {
    const artistasConDatos: ArtistaDisplay[] = artistas
      .filter((artista) => !artista.isDeleted)
      .map((artista) => ({
        id: artista.id,
        nombre: artista.nombre,
        nacionalidad: artista.nacionalidad,
        fechaNacimiento: artista.fechaNacimiento || "No especificada",
      }));
    setArtistasDisplay(artistasConDatos);
  };

  const handleCreate = (): void => {
    setSelectedArtista(null);
    setShowModal(true);
  };

  const handleEdit = (artistaDisplay: ArtistaDisplay): void => {
    const artistaCompleto = artistas.find((a) => a.id === artistaDisplay.id);
    if (artistaCompleto) {
      setSelectedArtista(artistaCompleto);
      setShowModal(true);
    }
  };

  const handleDelete = async (
    artistaDisplay: ArtistaDisplay
  ): Promise<void> => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar al artista "${artistaDisplay.nombre}"?`
      )
    ) {
      try {
        await deleteArtista(artistaDisplay.id);
        await recargarDatos();
      } catch (error) {
        console.error("Error eliminando artista:", error);
        alert("Error al eliminar el artista");
      }
    }
  };

  const handleSave = async (artistaGuardado: Artista): Promise<void> => {
    try {
      const index = artistas.findIndex((a) => a.id === artistaGuardado.id);

      if (index >= 0) {
        await putArtista(artistaGuardado.id, artistaGuardado);
      } else {
        await postArtista(artistaGuardado);
      }

      await recargarDatos();
      setShowModal(false);
    } catch (error) {
      console.error("Error guardando artista:", error);
      alert("Error al guardar el artista");
    }
  };

  const recargarDatos = async (): Promise<void> => {
    try {
      const artistasRes = await getArtistas();
      setArtistas(artistasRes.data);
    } catch (error) {
      console.error("Error recargando artistas:", error);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <TableHeader title="Gestión de Artistas" onCreateClick={handleCreate} />

      <Table
        data={artistasDisplay}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ArtistaModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSave}
        artista={selectedArtista}
      />
    </div>
  );
};

export default ArtistasPage;
