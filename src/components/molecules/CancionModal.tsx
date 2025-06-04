import { useState, useEffect } from "react";
import type { Cancion } from "../../types/models/Cancion";
import type { Genero } from "../../types/models/Genero";
import type { Artista } from "../../types/models/Artista";

interface CancionModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (song: Cancion) => void;
  cancion?: Cancion | null;
  generos: Genero[];
  artistas: Artista[];
}

interface CancionFormData {
  titulo: string;
  duracionMinutos: string;
  generoId: string;
  artistaId: string;
}

const CancionModal = ({
  show,
  onHide,
  onSave,
  cancion: song = null,
  generos: generos = [],
  artistas: artists = [],
}: CancionModalProps) => {
  const [formData, setFormData] = useState<CancionFormData>({
    titulo: "",
    duracionMinutos: "",
    generoId: "",
    artistaId: "",
  });

  const [errors, setErrors] = useState<Partial<CancionFormData>>({});

  useEffect(() => {
    if (song) {
      setFormData({
        titulo: song.titulo || "",
        duracionMinutos: song.duracionMinutos?.toString() || "",
        generoId: song.generoId?.toString() || "",
        artistaId: song.artistaId?.toString() || "",
      });
    } else {
      setFormData({
        titulo: "",
        duracionMinutos: "",
        generoId: "",
        artistaId: "",
      });
    }
    setErrors({});
  }, [song, show]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof CancionFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CancionFormData> = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = "El título es obligatorio";
    }

    if (!formData.duracionMinutos) {
      newErrors.duracionMinutos = "La duración es obligatoria";
    } else if (parseFloat(formData.duracionMinutos) <= 0) {
      newErrors.duracionMinutos = "La duración debe ser mayor a 0";
    }

    if (!formData.generoId) {
      newErrors.generoId = "Debe seleccionar un género";
    }

    if (!formData.artistaId) {
      newErrors.artistaId = "Debe seleccionar un artista";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const cancionData: Omit<Cancion, "id" | "isDeleted"> = {
        titulo: formData.titulo.trim(),
        duracionMinutos: parseFloat(formData.duracionMinutos),
        generoId: parseInt(formData.generoId),
        artistaId: parseInt(formData.artistaId),
      };

      onSave({
        titulo: cancionData.titulo,
        duracionMinutos: cancionData.duracionMinutos,
        generoId: cancionData.generoId,
        artistaId: cancionData.artistaId,
        id: song?.id ?? 0,
        isDeleted: false,
      });
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {song ? "Editar Canción" : "Agregar Nueva Canción"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onHide}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="titulo" className="form-label">
                Título *
              </label>
              <input
                type="text"
                className={`form-control ${errors.titulo ? "is-invalid" : ""}`}
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
              />
              {errors.titulo && (
                <div className="invalid-feedback">{errors.titulo}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="duracionMinutos" className="form-label">
                Duración (minutos) *
              </label>
              <input
                type="number"
                className={`form-control ${
                  errors.duracionMinutos ? "is-invalid" : ""
                }`}
                id="duracionMinutos"
                name="duracionMinutos"
                value={formData.duracionMinutos}
                onChange={handleChange}
                min="0.1"
                step="0.1"
              />
              {errors.duracionMinutos && (
                <div className="invalid-feedback">{errors.duracionMinutos}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="generoId" className="form-label">
                Género *
              </label>
              <select
                className={`form-select ${errors.generoId ? "is-invalid" : ""}`}
                id="generoId"
                name="generoId"
                value={formData.generoId}
                onChange={handleChange}
              >
                <option value="">Seleccionar género...</option>
                {generos.map((genero) => (
                  <option key={genero.id} value={genero.id}>
                    {genero.generoNombre}
                  </option>
                ))}
              </select>
              {errors.generoId && (
                <div className="invalid-feedback">{errors.generoId}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="artistaId" className="form-label">
                Artista *
              </label>
              <select
                className={`form-select ${
                  errors.artistaId ? "is-invalid" : ""
                }`}
                id="artistaId"
                name="artistaId"
                value={formData.artistaId}
                onChange={handleChange}
              >
                <option value="">Seleccionar artista...</option>
                {artists.map((artist) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.nombre}
                  </option>
                ))}
              </select>
              {errors.artistaId && (
                <div className="invalid-feedback">{errors.artistaId}</div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onHide}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              {song ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancionModal;
