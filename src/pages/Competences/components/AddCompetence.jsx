import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addCompetence, editCompetence } from '../../../features/competences/competencesSlice';
import { Save } from 'lucide-react';
import PropTypes from 'prop-types';

const AddCompetence = ({ closeModal, selectedCompetence }) => {
  const dispatch = useDispatch();
  const isEditMode = Boolean(selectedCompetence);

  // State to hold form data
  const [formData, setFormData] = useState({
    code_competence: '',
    intitule_competence: '',
    intitule_module: '',
    cours: '',
    quiz: '',
  });

  // State to hold validation errors
  const [errors, setErrors] = useState({});

  // State to handle submission result (success/error)
  const [submitError, setSubmitError] = useState('');

  // Effect to populate form with selected competence data (for editing)
  useEffect(() => {
    if (selectedCompetence) {
      setFormData({
        code_competence: selectedCompetence.code_competence || '',
        intitule_competence: selectedCompetence.intitule_competence.join(', ') || '',
        intitule_module: selectedCompetence.intitule_module || '',
        cours: Array.isArray(selectedCompetence.cours)
          ? selectedCompetence.cours.join(', ')
          : selectedCompetence.cours || '',
        quiz: Array.isArray(selectedCompetence.quiz)
          ? selectedCompetence.quiz.join(', ')
          : selectedCompetence.quiz || '',
      });
    } else {
      setFormData({
        code_competence: '',
        intitule_competence: '',
        intitule_module: '',
        cours: '',
        quiz: '',
      });
    }
  }, [selectedCompetence]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    if (!formData.code_competence.trim()) newErrors.code_competence = 'Code Competence is required';
    if (!formData.intitule_competence.trim())
      newErrors.intitule_competence = 'Intitulé Competence is required';
    if (!formData.intitule_module.trim()) newErrors.intitule_module = 'Intitulé Module is required';
    if (!formData.cours.trim()) newErrors.cours = 'Cours is required';
    if (!formData.quiz.trim()) newErrors.quiz = 'Quiz is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form default submission

    // Validate the form before submission
    if (!validateForm()) return;

    const competenceData = {
      code_competence: formData.code_competence,
      intitule_competence: formData.intitule_competence
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      intitule_module: formData.intitule_module,
      cours: (typeof formData.cours === 'string' ? formData.cours : '')
        .split(',')
        .map((cour) => cour.trim())
        .filter(Boolean),
      quiz: (typeof formData.quiz === 'string' ? formData.quiz : '')
        .split(',')
        .map((quiz) => quiz.trim())
        .filter(Boolean),
    };

    try {
      console.log('Competence data being dispatched:', competenceData);
      if (isEditMode) {
        await dispatch(editCompetence({ ...selectedCompetence, ...competenceData }));
      } else {
        await dispatch(addCompetence(competenceData)); // Add new competence
      }
      closeModal(); // Close modal after successful save
    } catch (error) {
      console.error('Error saving competence:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitError && <p className="text-red-600 text-xs">{submitError}</p>}

      <div>
        <label className="block text-sm font-semibold">Code Competence</label>
        <input
          type="text"
          name="code_competence"
          value={formData.code_competence}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded"
        />
        {errors.code_competence && <p className="text-red-600 text-xs">{errors.code_competence}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold">Intitulé Competence</label>
        <input
          type="text"
          name="intitule_competence"
          value={formData.intitule_competence}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded"
        />
        {errors.intitule_competence && (
          <p className="text-red-600 text-xs">{errors.intitule_competence}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold">Intitulé Module</label>
        <input
          type="text"
          name="intitule_module"
          value={formData.intitule_module}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded"
        />
        {errors.intitule_module && <p className="text-red-600 text-xs">{errors.intitule_module}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold">Cours</label>
        <input
          type="text"
          name="cours"
          value={formData.cours}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded"
        />
        {errors.cours && <p className="text-red-600 text-xs">{errors.cours}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold">Quiz</label>
        <input
          type="text"
          name="quiz"
          value={formData.quiz}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded"
        />
        {errors.quiz && <p className="text-red-600 text-xs">{errors.quiz}</p>}
      </div>

      <div className="modal-action">
        <button type="button" onClick={closeModal} className="btn btn-ghost">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary gap-2">
          <Save className="w-4 h-4" />
          <span>{isEditMode ? 'Save Changes' : 'Add Competence'}</span>
        </button>
      </div>
    </form>
  );
};

AddCompetence.propTypes = {
  closeModal: PropTypes.func.isRequired,
  selectedCompetence: PropTypes.object,
};

export default AddCompetence;
