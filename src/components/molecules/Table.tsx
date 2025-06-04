import type BaseEntity from "../../types/models/BaseEntity";

interface TableProps<T extends BaseEntity> {
  data?: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  loading?: boolean;
}

const Table = <T extends BaseEntity>({
  data = [],
  onEdit,
  onDelete,
  onView,
  loading = false,
}: TableProps<T>) => {
  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="alert alert-info text-center">
        <i className="bi bi-info-circle me-2"></i>
        No hay datos para mostrar
      </div>
    );
  }

  const columns = Object.keys(data[0]).filter(
    (key) => key.toLowerCase() !== "id"
  );
  const hasActions = onEdit || onDelete || onView;

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "Sí" : "No";
    if (typeof value === "number") return value.toString();
    return String(value);
  };

  const formatColumnName = (column: string): string => {
    return column.charAt(0).toUpperCase() + column.slice(1);
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col">
                {formatColumnName(column)}
              </th>
            ))}
            {hasActions && (
              <th scope="col" className="text-center">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id || index}>
              {columns.map((column) => (
                <td key={column}>{formatValue(item[column])}</td>
              ))}
              {hasActions && (
                <td className="text-center">
                  <div className="btn-group" role="group">
                    {onView && (
                      <button
                        className="btn btn-outline-info btn-sm"
                        onClick={() => onView(item)}
                        title="Ver"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                    )}
                    {onEdit && (
                      <button
                        className="btn btn-outline-warning btn-sm"
                        onClick={() => onEdit(item)}
                        title="Editar"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => onDelete(item)}
                        title="Eliminar"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
