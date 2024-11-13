import { useDispatch } from 'react-redux';
import { deleteCompetence } from '../../../features/competences/CompetenceSlice';
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
    { icon: <BookOpen className="w-5 h-5" />, label: 'Intitulé Competence', value: competence.intitule_competence.join(', ') || 'No title provided' },
    { icon: <Code className="w-5 h-5" />, label: 'Code Competence', value: competence.code_competence || 'No code provided' },
    { icon: <Building2 className="w-5 h-5" />, label: 'Module', value: competence.intitule_module || 'No module assigned' },
    { icon: <Users className="w-5 h-5" />, label: 'Cours', value: competence.cours || 'No courses assigned' },
    { icon: <Users className="w-5 h-5" />, label: 'Quiz', value: competence.quiz || 'No quizzes assigned' }
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Competence Details</h2>
      </div>

      <div className="space-y-6">
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

      <div className="mt-6 flex justify-end gap-4">
        <button onClick={closeModal} className="btn btn-ghost">
          <X className="w-4 h-4" /> Close
        </button>
        <button onClick={handleDelete} className="btn btn-error">
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
