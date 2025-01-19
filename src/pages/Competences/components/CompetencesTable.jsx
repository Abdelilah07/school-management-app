import { Link } from 'react-router';
import { Eye, Edit, Trash2, Code, BookOpen, AlertCircle } from 'lucide-react';
import { DataTable } from '../../../components';

const CompetencesTable = ({ competences, sortConfig, onSort, onView, onEdit, onDelete }) => {
  const handleDelete = (competence, e) => {
    e.stopPropagation();
    onDelete(competence);
  };

  const columns = [
    {
      key: 'code_competence',
      label: 'Code',
      sortable: true,
      className: 'font-medium',
    },
    {
      key: 'intitule_competence',
      label: 'Intitulé',
      sortable: true,
      render: (row) =>
        Array.isArray(row.intitule_competence)
          ? row.intitule_competence.join(', ')
          : row.intitule_competence,
    },
    {
      key: 'intitule_module',
      label: 'Module',
      sortable: true,
      mobileTruncate: true,
    },
    {
      key: 'filiere',
      label: 'Filière',
      sortable: true,
      render: (row) => <span className="badge badge-ghost badge-sm">{row.filiere}</span>,
    },
    {
      key: 'cours',
      label: 'Cours',
      render: (row) =>
        Array.isArray(row.cours) ? (
          <span className="badge badge-ghost badge-sm">{row.cours.length} cours</span>
        ) : (
          '0 cours'
        ),
    },
    {
      key: 'quiz',
      label: 'Quiz',
      render: (row) =>
        Array.isArray(row.quiz) ? (
          <span className="badge badge-ghost badge-sm">{row.quiz.length} quiz</span>
        ) : (
          '0 quiz'
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
      data={competences}
      columns={columns}
      sortConfig={sortConfig}
      onSort={onSort}
      emptyStateProps={{
        icon: AlertCircle,
        title: 'Aucune compétence trouvée',
        description: 'Commencez par ajouter une nouvelle compétence',
      }}
    />
  );
};

export default CompetencesTable;
