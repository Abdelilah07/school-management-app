import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2, Users, AlertCircle } from 'lucide-react';
import { DataTable } from '../../../components';
const FilieresTable = ({ filieres, sortConfig, onSort, onView, onEdit, onDelete }) => {
  const handleDelete = (filiere, e) => {
    e.stopPropagation();
    onDelete(filiere);
  };

  const columns = [
    {
      key: 'code_filiere',
      label: 'Code',
      sortable: true,
      className: 'font-medium',
    },
    {
      key: 'intitule_filiere',
      label: 'Intitulé',
      sortable: true,
      mobileTruncate: true,
    },
    {
      key: 'secteur',
      label: 'Secteur',
      sortable: true,
      mobileSecondary: true,
      render: (row) => <span className="badge badge-ghost badge-sm">{row.secteur}</span>,
    },
    {
      key: 'groupes',
      label: 'Groupes',
      render: (row) => (
        <Link to={`/filieres/groupes/${row.code_filiere}`} className="btn btn-ghost btn-xs gap-2">
          <Users className="w-4 h-4" />
          {Array.isArray(row.groupes) ? row.groupes.length : 0} groupes
        </Link>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      render: (row) => (
        <>
          {/* Desktop actions */}
          <div className="hidden md:flex justify-end gap-2">
            <button
              onClick={() => onView(row)}
              className="btn btn-ghost btn-xs tooltip"
              data-tip="Voir les détails"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(row)}
              className="btn btn-ghost btn-xs tooltip"
              data-tip="Modifier"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => handleDelete(row, e)}
              className="btn btn-ghost btn-xs text-error tooltip"
              data-tip="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          {/* Mobile actions */}
          <div className="md:hidden">
            <button onClick={() => onView(row)} className="btn btn-ghost btn-sm btn-square">
              <Eye className="w-4 h-4" />
            </button>
            <button onClick={() => onEdit(row)} className="btn btn-ghost btn-sm btn-square">
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => handleDelete(row, e)}
              className="btn btn-ghost btn-sm btn-square text-error"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </>
      ),
    },
  ];

  return (
    <DataTable
      data={filieres}
      columns={columns}
      sortConfig={sortConfig}
      onSort={onSort}
      emptyStateProps={{
        icon: AlertCircle,
        title: 'Aucune filière trouvée',
        description: 'Commencez par ajouter une nouvelle filière',
      }}
    />
  );
};

export default FilieresTable;
