import { BookOpen, Code, Building2, Users } from 'lucide-react';
import { DetailView } from '../../../components';

const ViewFiliere = ({ filiere, onClose, onDelete }) => {
  const fields = [
    {
      key: 'intitule_filiere',
      label: 'Intitulé Filière',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      key: 'code_filiere',
      label: 'Code Filière',
      icon: <Code className="w-5 h-5" />,
    },
    {
      key: 'secteur',
      label: 'Secteur',
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      key: 'groupes',
      label: 'Groupes',
      icon: <Users className="w-5 h-5" />,
      render: (data) => (Array.isArray(data.groupes) ? data.groupes.join(', ') : 'Aucun groupe'),
    },
  ];

  return (
    <DetailView
      title="Détails de la Filière"
      data={filiere}
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

export default ViewFiliere;
