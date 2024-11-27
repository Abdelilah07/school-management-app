import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2, Users, AlertCircle } from 'lucide-react';
import DataTable from '../../../components/shared/DataTable'; // Adjust the import path accordingly

const SecteursTable = ({ secteurs, sortConfig, onSort, onView, onEdit, onDelete }) => {
  const handleDelete = (secteur, e) => {
    e.stopPropagation();
    onDelete(secteur);
  };

  const columns = [
    {
      key: 'code_secteur',
      label: 'Code',
      sortable: true,
      mobileTruncate: true,
    },
    {
      key: 'intitule_secteur',
      label: 'Intitulé',
      sortable: true,
      mobileTruncate: true,
    },
    {
      key: 'filieres',
      label: 'Filières',
      render: (row) => {
        const filiereCount = row.filieres ? row.filieres.length : 0;
        return (
          <Link
            to={`/secteurs/filieres/${row.code_secteur}`}
            className="btn btn-ghost btn-xs gap-2"
          >
            <Users className="w-4 h-4" />
            {filiereCount} filière{filiereCount !== 1 ? 's' : ''}
          </Link>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      render: (row) => (
        <>
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
      data={secteurs}
      columns={columns}
      sortConfig={sortConfig}
      onSort={onSort}
      emptyStateProps={{
        icon: AlertCircle,
        title: 'Aucun secteur trouvé',
        description: 'Commencez par ajouter un nouveau secteur',
      }}
    />
  );
};

export default SecteursTable;
