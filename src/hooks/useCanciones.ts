import { useEffect, useState } from "react";
import { getArtistas } from "../services/artistaService";
import {
  getCanciones,
  postCancion,
  putCancion,
  deleteCancion,
} from "../services/cancionServise";
import { getGeneros } from "../services/generoService";
import type { Artista } from "../types/models/Artista";
import type { Cancion } from "../types/models/Cancion";
import type { Genero } from "../types/models/Genero";

interface CancionDisplay {
  id: number;
  titulo: string;
  duracionMinutos: number;
  artista: string;
  genero: string;
  isDeleted: boolean;
}

interface UseCanciones {
  canciones: Cancion[];
  cancionesDisplay: CancionDisplay[];
  generos: Genero[];
  artistas: Artista[];
  loading: boolean;
  error: string | null;
  crearCancion: (cancion: Cancion) => Promise<Cancion>;
  actualizarCancion: (id: number, cancion: Cancion) => Promise<Cancion>;
  eliminarCancion: (id: number) => Promise<void>;
  recargarCanciones: () => Promise<void>;
}

export const useCanciones = (): UseCanciones => {
  const [canciones, setCanciones] = useState<Cancion[]>([]);
  const [cancionesDisplay, setCancionesDisplay] = useState<CancionDisplay[]>(
    []
  );
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const [cancionesRes, generosRes, artistasRes] = await Promise.all([
        getCanciones(),
        getGeneros(),
        getArtistas(),
      ]);

      const cancionesData = cancionesRes.data;
      const generosData = generosRes.data;
      const artistasData = artistasRes.data;

      setCanciones(cancionesData);
      setGeneros(generosData);
      setArtistas(artistasData);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    const cancionesConDatos: CancionDisplay[] = canciones
      .filter((cancion) => !cancion.isDeleted)
      .map((cancion) => ({
        id: cancion.id,
        titulo: cancion.titulo,
        duracionMinutos: cancion.duracionMinutos,
        artista:
          artistas.find((a) => a.id === cancion.artistaId)?.nombre ||
          "Desconocido",
        genero:
          generos.find((g) => g.id === cancion.generoId)?.generoNombre ||
          "Desconocido",
        isDeleted: cancion.isDeleted,
      }));

    setCancionesDisplay(cancionesConDatos);
  }, [canciones, artistas, generos]);

  const crearCancion = async (cancionData: Cancion): Promise<Cancion> => {
    try {
      const response = await postCancion(cancionData);
      const nuevaCancion = response.data;
      setCanciones((prev) => [...prev, nuevaCancion]);
      return nuevaCancion;
    } catch (err) {
      console.error("Error creando canción:", err);
      throw new Error("Error al crear la canción");
    }
  };

  const actualizarCancion = async (
    id: number,
    cancionData: Cancion
  ): Promise<Cancion> => {
    try {
      const response = await putCancion(id, cancionData);
      const cancionActualizada = new response.data();

      setCanciones((prev) =>
        prev.map((cancion) =>
          cancion.id === id ? cancionActualizada : cancion
        )
      );

      return cancionActualizada;
    } catch (err) {
      console.error("Error actualizando canción:", err);
      throw new Error("Error al actualizar la canción");
    }
  };

  const eliminarCancion = async (id: number): Promise<void> => {
    try {
      await deleteCancion(id);
      setCanciones((prev) => prev.filter((cancion) => cancion.id !== id));
    } catch (err) {
      console.error("Error eliminando canción:", err);
      throw new Error("Error al eliminar la canción");
    }
  };

  const recargarCanciones = async (): Promise<void> => {
    try {
      const response = await getCanciones();
      const cancionesData = response.data;
      setCanciones(cancionesData);
    } catch (err) {
      console.error("Error recargando canciones:", err);
      setError("Error al recargar las canciones");
    }
  };

  return {
    canciones,
    cancionesDisplay,
    generos,
    artistas,
    loading,
    error,
    crearCancion,
    actualizarCancion,
    eliminarCancion,
    recargarCanciones,
  };
};
