import { useState, useEffect } from "react";
import type { Artista } from "../../types/models/Artista";

interface ArtistaModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (artista: Artista) => void;
  artista?: Artista | null;
}

const ArtistaModal: React.FC<ArtistaModalProps> = ({
  show,
  onHide,
  onSave,
  artista,
}) => {
  const [formData, setFormData] = useState<Artista>({
    id: 0,
    nombre: "",
    nacionalidad: "",
    fechaNacimiento: "",
    isDeleted: false,
  });

  const [errors, setErrors] = useState<{
    nombre?: string;
    nacionalidad?: string;
  }>({});

  useEffect(() => {
    if (artista) {
      setFormData({
        ...artista,
        fechaNacimiento: artista.fechaNacimiento || "",
      });
    } else {
      setFormData({
        id: 0,
        nombre: "",
        nacionalidad: "",
        fechaNacimiento: "",
        isDeleted: false,
      });
    }
    setErrors({});
  }, [artista, show]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.nacionalidad.trim()) {
      newErrors.nacionalidad = "La nacionalidad es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const artistaToSave: Artista = {
      ...formData,
      fechaNacimiento: formData.fechaNacimiento || undefined,
    };

    onSave(artistaToSave);
  };

  const handleClose = () => {
    setFormData({
      id: 0,
      nombre: "",
      nacionalidad: "",
      fechaNacimiento: "",
      isDeleted: false,
    });
    setErrors({});
    onHide();
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
              {artista ? "Editar Artista" : "Nuevo Artista"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">
                  Nombre *
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.nombre ? "is-invalid" : ""
                  }`}
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ingrese el nombre del artista"
                />
                {errors.nombre && (
                  <div className="invalid-feedback">{errors.nombre}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="nacionalidad" className="form-label">
                  Nacionalidad *
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.nacionalidad ? "is-invalid" : ""
                  }`}
                  id="nacionalidad"
                  name="nacionalidad"
                  value={formData.nacionalidad}
                  onChange={handleInputChange}
                  placeholder="Ingrese la nacionalidad"
                />
                {errors.nacionalidad && (
                  <div className="invalid-feedback">{errors.nacionalidad}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="fechaNacimiento" className="form-label">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                {artista ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArtistaModal;
