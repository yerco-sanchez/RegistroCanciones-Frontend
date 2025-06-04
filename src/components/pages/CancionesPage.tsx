import { useState, useEffect } from "react";
import { getArtistas } from "../../services/artistaService";
import {
  getCanciones,
  deleteCancion,
  postCancion,
  putCancion,
} from "../../services/cancionServise";
import { getGeneros } from "../../services/generoService";
import type { Artista } from "../../types/models/Artista";
import type { Cancion } from "../../types/models/Cancion";
import type { Genero } from "../../types/models/Genero";
import CancionModal from "../molecules/CancionModal";
import Table from "../molecules/Table";
import TableHeader from "../molecules/TableHeader";

interface CancionDisplay {
  id: number;
  titulo: string;
  duracion: number;
  artista: string;
  genero: string;
}

const CancionesPage = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCancion, setSelectedCancion] = useState<Cancion | null>(null);
  const [canciones, setCanciones] = useState<Cancion[]>([]);
  const [cancionesDisplay, setCancionesDisplay] = useState<CancionDisplay[]>(
    []
  );
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [cancionesRes, generosRes, artistasRes] = await Promise.all([
          getCanciones(),
          getGeneros(),
          getArtistas(),
        ]);

        setCanciones(cancionesRes.data);
        setGeneros(generosRes.data);
        setArtistas(artistasRes.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  useEffect(() => {
    if (canciones.length > 0 && artistas.length > 0 && generos.length > 0) {
      convertirDatos(canciones);
    }
  }, [canciones, artistas, generos]);

  const convertirDatos = (canciones: Cancion[]) => {
    const cancionesConDatos: CancionDisplay[] = canciones
      .filter((cancion) => !cancion.isDeleted)
      .map((cancion) => ({
        id: cancion.id,
        titulo: cancion.titulo,
        duracion: cancion.duracionMinutos,
        artista:
          artistas.find((a) => a.id === cancion.artistaId)?.nombre ||
          "Desconocido",
        genero:
          generos.find((g) => g.id === cancion.generoId)?.generoNombre ||
          "Desconocido",
      }));
    setCancionesDisplay(cancionesConDatos);
  };

  const handleCreate = (): void => {
    setSelectedCancion(null);
    setShowModal(true);
  };

  const handleEdit = (cancionDisplay: CancionDisplay): void => {
    const cancionCompleta = canciones.find((c) => c.id === cancionDisplay.id);
    if (cancionCompleta) {
      setSelectedCancion(cancionCompleta);
      setShowModal(true);
    }
  };

  const handleDelete = async (
    cancionDisplay: CancionDisplay
  ): Promise<void> => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar "${cancionDisplay.titulo}"?`
      )
    ) {
      try {
        await deleteCancion(cancionDisplay.id);
        console.log(cancionDisplay);
        await recargarDatos();
      } catch (error) {
        console.error("Error eliminando canción:", error);
        alert("Error al eliminar la canción");
      }
    }
  };

  const handleSave = async (cancionGuardada: Cancion): Promise<void> => {
    try {
      const index = canciones.findIndex((c) => c.id === cancionGuardada.id);

      if (index >= 0) {
        await putCancion(cancionGuardada.id, cancionGuardada);
      } else {
        await postCancion(cancionGuardada);
      }

      await recargarDatos();
      setShowModal(false);
    } catch (error) {
      console.error("Error guardando canción:", error);
      alert("Error al guardar la canción");
    }
  };

  const recargarDatos = async (): Promise<void> => {
    try {
      const cancionesRes = await getCanciones();
      setCanciones(cancionesRes.data);
    } catch (error) {
      console.error("Error recargando canciones:", error);
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
    <div className="container-fluid px-4 py-3">
      <TableHeader title="Catálogo de Canciones" onCreateClick={handleCreate} />
      <Table
        data={cancionesDisplay}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <CancionModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSave}
        cancion={selectedCancion}
        generos={generos}
        artistas={artistas}
      />
    </div>
  );
};

export default CancionesPage;
