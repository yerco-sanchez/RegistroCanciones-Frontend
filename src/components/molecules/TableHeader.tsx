interface TableHeaderProps {
  title: string;
  onCreateClick?: () => void;
}

const TableHeader = ({ title, onCreateClick }: TableHeaderProps) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h2 className="mb-0">{title}</h2>
      {onCreateClick && (
        <button className="btn btn-primary" onClick={onCreateClick}>
          <i className="bi bi-plus-circle me-2"></i>
          Agregar
        </button>
      )}
    </div>
  );
};

export default TableHeader;
