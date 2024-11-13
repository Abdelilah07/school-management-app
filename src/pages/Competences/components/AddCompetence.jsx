import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addCompetence, editCompetence } from '../../../features/competences/CompetenceSlice';
import { Code, BookOpen, Building2, Users, Save } from 'lucide-react';
import PropTypes from 'prop-types';

const AddCompetence = ({ closeModal, selectedCompetence, onSave }) => {
  const dispatch = useDispatch();
  const isEditMode = Boolean(selectedCompetence);

  // State to hold form data
  const [formData, setFormData] = useState({
    code_competence: '',
    intitule_competence: '',
    intitule_module: '',
    cours: '',
    quiz: ''
  });

  // State to hold validation errors
  const [errors, setErrors] = useState({});

  // Effect to populate form with selected competence data (for editing)
  useEffect(() => {
    if (selectedCompetence) {
      setFormData({
        code_competence: selectedCompetence.code_competence || '',
        intitule_competence: selectedCompetence.intitule_competence.join(', ') || '', // Ensure it's a string for display
        intitule_module: selectedCompetence.intitule_module || '',
        cours: selectedCompetence.cours || '', 
        quiz: selectedCompetence.quiz || '' 
      });
    }
  }, [selectedCompetence]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error message when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    if (!formData.code_competence.trim()) {
      newErrors.code_competence = 'Code Competence is required';
    }
    if (!formData.intitule_competence.trim()) {
      newErrors.intitule_competence = 'Intitulé Competence is required';
    }
    if (!formData.intitule_module.trim()) {
      newErrors.intitule_module = 'Intitulé Module is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit the form (either add or edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const competenceData = {
      code_competence: formData.code_competence,
      intitule_competence: formData.intitule_competence.split(',').map((item) => item.trim()).filter(Boolean),
      intitule_module: formData.intitule_module,
      cours: formData.cours.split(',').map((cour) => cour.trim()).filter(Boolean),
      quiz: formData.quiz.split(',').map((quiz) => quiz.trim()).filter(Boolean)
    };

    try {
      if (isEditMode) {
        await dispatch(editCompetence({ ...selectedCompetence, ...competenceData }));
      } else {
        await dispatch(addCompetence(competenceData)); // Add new competence
      }
      closeModal();
      onSave?.(competenceData); // Call onSave if provided
    } catch (error) {
      console.error('Error saving competence:', error.message);
    }
  };

  // Form fields configuration
  const formFields = [
    {
      id: 'code_competence',
      label: 'Code Competence',
      icon: <Code className="w-4 h-4" />,
      placeholder: 'Enter code competence',
    },
    {
      id: 'intitule_competence',
      label: 'Intitulé Competence',
      icon: <Building2 className="w-4 h-4" />,
      placeholder: 'Enter intitulé competence',
    },
    {
      id: 'intitule_module',
      label: 'Intitulé Module',
      icon: <BookOpen className="w-4 h-4" />,
      placeholder: 'Enter intitulé module',
    },
    {
      id: 'cours',
      label: 'Cours (comma separated)',
      icon: <Users className="w-4 h-4" />,
      placeholder: 'Enter cours names',
    },
    {
      id: 'quiz',
      label: 'Quiz (comma separated)',
      icon: <Users className="w-4 h-4" />,
      placeholder: 'Enter quiz names',
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formFields.map((field) => (
        <div key={field.id} className="relative">
          <label htmlFor={field.id} className="text-sm font-semibold">{field.label}</label>
          <div className="flex items-center space-x-2">
            {field.icon}
            <input
              type="text"
              id={field.id}
              name={field.id}
              value={formData[field.id]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="border p-2 w-full rounded"
            />
          </div>
          {errors[field.id] && (
            <p className="text-red-600 text-xs">{errors[field.id]}</p>
          )}
        </div>
      ))}

      <div className="flex justify-end space-x-4">
        <button type="button" onClick={closeModal} className="bg-gray-300 text-black px-4 py-2 rounded">
          Cancel
        </button>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded flex items-center space-x-2">
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
  onSave: PropTypes.func
};

export default AddCompetence;
