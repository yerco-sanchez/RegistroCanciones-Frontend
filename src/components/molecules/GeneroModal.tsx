import { useState, useEffect } from "react";
import type { Genero } from "../../types/models/Genero";

interface GeneroModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (genero: Genero) => void;
  genero?: Genero | null;
}

const GeneroModal: React.FC<GeneroModalProps> = ({
  show,
  onHide,
  onSave,
  genero,
}) => {
  const [formData, setFormData] = useState<Genero>({
    id: 0,
    generoNombre: "",
    isDeleted: false,
  });

  const [errors, setErrors] = useState<{
    generoNombre?: string;
  }>({});

  useEffect(() => {
    if (genero) {
      setFormData({ ...genero });
    } else {
      setFormData({
        id: 0,
        generoNombre: "",
        isDeleted: false,
      });
    }
    setErrors({});
  }, [genero, show]);

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

    if (!formData.generoNombre.trim()) {
      newErrors.generoNombre = "El nombre del género es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSave(formData);
  };

  const handleClose = () => {
    setFormData({
      id: 0,
      generoNombre: "",
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
              {genero ? "Editar Género" : "Nuevo Género"}
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
                <label htmlFor="generoNombre" className="form-label">
                  Nombre del Género *
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.generoNombre ? "is-invalid" : ""
                  }`}
                  id="generoNombre"
                  name="generoNombre"
                  value={formData.generoNombre}
                  onChange={handleInputChange}
                  placeholder="Ingrese el nombre del género"
                />
                {errors.generoNombre && (
                  <div className="invalid-feedback">{errors.generoNombre}</div>
                )}
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
                {genero ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GeneroModal;
