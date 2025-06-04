import { useState, useEffect } from "react";
import {
  getGeneros,
  deleteGenero,
  putGenero,
  postGenero,
} from "../../services/generoService";
import type { Genero } from "../../types/models/Genero";
import Table from "../molecules/Table";
import TableHeader from "../molecules/TableHeader";
import GeneroModal from "../molecules/GeneroModal";

interface GeneroDisplay {
  id: number;
  generoNombre: string;
}

const GenerosPage = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedGenero, setSelectedGenero] = useState<Genero | null>(null);
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [generosDisplay, setGenerosDisplay] = useState<GeneroDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const generosRes = await getGeneros();
        setGeneros(generosRes.data);
      } catch (error) {
        console.error("Error cargando géneros:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  useEffect(() => {
    if (generos.length > 0) {
      convertirDatos(generos);
    }
  }, [generos]);

  const convertirDatos = (generos: Genero[]) => {
    const generosConDatos: GeneroDisplay[] = generos
      .filter((genero) => !genero.isDeleted)
      .map((genero) => ({
        id: genero.id,
        generoNombre: genero.generoNombre,
      }));
    setGenerosDisplay(generosConDatos);
  };

  const handleCreate = (): void => {
    setSelectedGenero(null);
    setShowModal(true);
  };

  const handleEdit = (generoDisplay: GeneroDisplay): void => {
    const generoCompleto = generos.find((g) => g.id === generoDisplay.id);
    if (generoCompleto) {
      setSelectedGenero(generoCompleto);
      setShowModal(true);
    }
  };

  const handleDelete = async (generoDisplay: GeneroDisplay): Promise<void> => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar el género "${generoDisplay.generoNombre}"?`
      )
    ) {
      try {
        await deleteGenero(generoDisplay.id);
        await recargarDatos();
      } catch (error) {
        console.error("Error eliminando género:", error);
        alert("Error al eliminar el género");
      }
    }
  };

  const handleSave = async (generoGuardado: Genero): Promise<void> => {
    try {
      const index = generos.findIndex((g) => g.id === generoGuardado.id);

      if (index >= 0) {
        await putGenero(generoGuardado.id, generoGuardado);
      } else {
        await postGenero(generoGuardado);
      }

      await recargarDatos();
      setShowModal(false);
    } catch (error) {
      console.error("Error guardando género:", error);
      alert("Error al guardar el género");
    }
  };

  const recargarDatos = async (): Promise<void> => {
    try {
      const generosRes = await getGeneros();
      setGeneros(generosRes.data);
    } catch (error) {
      console.error("Error recargando géneros:", error);
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
      <TableHeader title="Gestión de Géneros" onCreateClick={handleCreate} />

      <Table
        data={generosDisplay}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <GeneroModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSave}
        genero={selectedGenero}
      />
    </div>
  );
};

export default GenerosPage;
