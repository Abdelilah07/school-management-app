import { useDispatch } from 'react-redux';
import { deleteCompetence } from '../../../features/competences/competencesSlice';
import { X, Trash2, BookOpen, Code, Building2, Users } from 'lucide-react';
import PropTypes from 'prop-types';

const ViewCompetence = ({ competence, closeModal }) => {
  const dispatch = useDispatch();

  // Delete competence handler with confirmation
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this Competence?')) {
      dispatch(deleteCompetence(competence.id));
      closeModal();
    }
  };

  // Details to display
  const detailItems = [
    {
      icon: <BookOpen className="w-4 h-4" />,
      label: 'Intitulé Competence',
      value: competence.intitule_competence.join(', ') || 'No title provided',
    },
    {
      icon: <Code className="w-4 h-4" />,
      label: 'Code Competence',
      value: competence.code_competence || 'No code provided',
    },
    {
      icon: <Building2 className="w-4 h-4" />,
      label: 'Module',
      value: competence.intitule_module || 'No module assigned',
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: 'Cours',
      value: competence.cours || 'No courses assigned',
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: 'Quiz',
      value: competence.quiz || 'No quizzes assigned',
    },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Competence Details</h2>
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
          <X className="w-4 h-4" /> Close
        </button>
        <button onClick={handleDelete} className="btn btn-error gap-2">
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>
    </div>
  );
};

ViewCompetence.propTypes = {
  competence: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default ViewCompetence;
