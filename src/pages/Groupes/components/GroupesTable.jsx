import { Link } from 'react-router';
import { Eye, Edit, Trash2, Users, AlertCircle } from 'lucide-react';
import { DataTable } from '../../../components';

const GroupesTable = ({ groups, sortConfig, onSort, onView, onEdit, onDelete }) => {
  const handleDelete = (group, e) => {
    e.stopPropagation();
    onDelete(group);
  };

  const columns = [
    {
      key: 'codeGroupe',
      label: 'code Groupe',
      sortable: true,
      className: 'font-medium',
    },

    {
      key: 'niveau',
      label: 'Niveau',
      sortable: true,
      mobileSecondary: true,
      render: (row) => <span className="badge badge-ghost badge-sm">{row.niveau}</span>,
    },
    {
      key: 'intituleGroupe',
      label: 'intitule Groupe',
      sortable: true,
      mobileTruncate: true,
    },
    {
      key: 'filiere',
      label: 'Filiere',
      sortable: true,
      mobileTruncate: true,
    },
    {
      key: 'modules',
      label: 'Modules',
      render: (row) => (
        <Link to={`/groups/modules/${row.codeGroupe}`} className="btn btn-ghost btn-xs gap-2">
          {Array.isArray(row.modules) ? row.modules.length : 0} modules
        </Link>
      ),
    },
    {
      key: 'emploiDuTemps',
      label: 'emploi Du Temps',
      render: (row) => (
        <Link
          to={`/groups/emplloiDuTemps/${row.codeGroupe}`}
          className="btn btn-ghost btn-xs gap-2"
        >
          Time Table
        </Link>
      ),
    },
    {
      key: 'liste',
      label: 'Liste',
      render: (row) => (
        <Link to={`/groups/liste/${row.codeGroupe}`} className="btn btn-ghost btn-xs gap-2">
          {Array.isArray(row.liste) ? row.liste.length : 1} liste
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
      data={groups}
      columns={columns}
      sortConfig={sortConfig}
      onSort={onSort}
      emptyStateProps={{
        icon: AlertCircle,
        title: 'Aucune groupe trouvée',
        description: 'Commencez par ajouter un nouvelle groupe',
      }}
    />
  );
};

export default GroupesTable;
