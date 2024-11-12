import { useDispatch } from 'react-redux';
import { deleteFiliere } from '../../../features/filieres/filieresSlice';
import { X, Trash2, BookOpen, Code, Building2, Users } from 'lucide-react';
import PropTypes from 'prop-types';

const ViewFiliere = ({ filiere, closeModal }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this filiere?')) {
      dispatch(deleteFiliere(filiere.id));
      closeModal();
    }
  };

  const detailItems = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: 'Intitulé Filière',
      value: filiere.intitule_filiere,
    },
    {
      icon: <Code className="w-5 h-5" />,
      label: 'Code Filière',
      value: filiere.code_filiere,
    },
    {
      icon: <Building2 className="w-5 h-5" />,
      label: 'Secteur',
      value: filiere.secteur,
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Groupes',
      value: filiere.groupes?.join(', ') || 'No groups assigned',
    },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Filière Details</h2>
      </div>

      <div className="card bg-base-100">
        <div className="card-body p-4 space-y-6">
          {detailItems.map((item, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="text-primary">{item.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-base-content opacity-70">{item.label}</h3>
                <p className="text-lg text-base-content">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="modal-action mt-6 flex justify-end gap-2">
        <button onClick={closeModal} className="btn btn-ghost gap-2">
          <X className="w-4 h-4" />
          Close
        </button>
        <button onClick={handleDelete} className="btn btn-error gap-2">
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
};

ViewFiliere.propTypes = {
  filiere: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default ViewFiliere;
