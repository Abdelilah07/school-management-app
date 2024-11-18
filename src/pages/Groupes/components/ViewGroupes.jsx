import { BookOpen, Code, Building2, Users, Clock } from 'lucide-react';
import { DetailView } from '../../../components';

const ViewGroupes = ({ group, onClose, onDelete }) => {
  const fields = [
    {
      key: 'intituleGroupe',
      label: 'intitule Groupe',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      key: 'filiere',
      label: 'Filière',
      icon: <Code className="w-5 h-5" />,
    },
    {
      key: 'niveau',
      label: 'niveau',
      icon: <Building2 className="w-5 h-5" />,
    },
    {
        key: 'emploiDuTemps',
        label: 'emploi Du Temps',
        icon: <Clock className="w-5 h-5" />,
      },
    {
      key: 'modules',
      label: 'Modules',
      icon: <Users className="w-5 h-5" />,
      render: (data) => (Array.isArray(data.modules) ? data.modules.join(', ') : 'Aucun module'),
    },
  ];

  return (
    <DetailView
      title="Détails du groupe"
      data={group}
      fields={fields}
      onClose={onClose}
      onDelete={onDelete}
      deleteButtonProps={{
        show: true,
        label: 'Supprimer',
        className: 'btn-error',
      }}
      closeButtonProps={{
        show: true,
        label: 'Fermer',
        className: 'btn-ghost',
      }}
    />
  );
};

export default ViewGroupes;
