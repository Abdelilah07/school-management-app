import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addFiliere, editFiliere } from '../../../features/filieres/filieresSlice';
import { Code, BookOpen, Building2, Users, Save, Plus } from 'lucide-react';
import PropTypes from 'prop-types';

const AddFiliere = ({ closeModal, selectedFiliere, onSave }) => {
  const dispatch = useDispatch();
  const isEditMode = Boolean(selectedFiliere);

  const [formData, setFormData] = useState({
    codeFiliere: '',
    intituleFiliere: '',
    secteur: '',
    groupes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedFiliere) {
      setFormData({
        codeFiliere: selectedFiliere.code_filiere || '',
        intituleFiliere: selectedFiliere.intitule_filiere || '',
        secteur: selectedFiliere.secteur || '',
        groupes: selectedFiliere.groupes?.join(', ') || '',
      });
    }
  }, [selectedFiliere]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.codeFiliere.trim()) {
      newErrors.codeFiliere = 'Code Filière is required';
    }
    if (!formData.intituleFiliere.trim()) {
      newErrors.intituleFiliere = 'Intitulé Filière is required';
    }
    if (!formData.secteur.trim()) {
      newErrors.secteur = 'Secteur is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const filiereData = {
      code_filiere: formData.codeFiliere,
      intitule_filiere: formData.intituleFiliere,
      secteur: formData.secteur,
      groupes: formData.groupes
        .split(',')
        .map((groupe) => groupe.trim())
        .filter(Boolean),
    };

    try {
      if (isEditMode) {
        await dispatch(editFiliere({ ...selectedFiliere, ...filiereData }));
        onSave?.(filiereData);
      } else {
        await dispatch(addFiliere(filiereData));
      }
      closeModal();
    } catch (error) {
      console.error('Error saving filière:', error.message);
    }
  };

  const formFields = [
    {
      id: 'codeFiliere',
      label: 'Code Filière',
      icon: <Code className="w-4 h-4" />,
      placeholder: 'Enter code filière',
    },
    {
      id: 'intituleFiliere',
      label: 'Intitulé Filière',
      icon: <BookOpen className="w-4 h-4" />,
      placeholder: 'Enter intitulé filière',
    },
    {
      id: 'secteur',
      label: 'Secteur',
      icon: <Building2 className="w-4 h-4" />,
      placeholder: 'Enter secteur',
    },
    {
      id: 'groupes',
      label: 'Groupes',
      icon: <Users className="w-4 h-4" />,
      placeholder: 'Enter groupes (comma-separated)',
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        {isEditMode ? <Save className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        {isEditMode ? 'Edit Filière' : 'Add Filière'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {formFields.map((field) => (
          <div key={field.id} className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                {field.icon}
                {field.label}
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                name={field.id}
                value={formData[field.id]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className={`input input-bordered w-full ${errors[field.id] ? 'input-error' : ''}`}
              />
            </div>
            {errors[field.id] && (
              <label className="label">
                <span className="label-text-alt text-error">{errors[field.id]}</span>
              </label>
            )}
          </div>
        ))}

        <div className="modal-action">
          <button type="button" onClick={closeModal} className="btn btn-ghost">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary gap-2">
            {isEditMode ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isEditMode ? 'Update Filière' : 'Add Filière'}
          </button>
        </div>
      </form>
    </div>
  );
};

AddFiliere.propTypes = {
  onSave: PropTypes.func,
  closeModal: PropTypes.func,
  selectedFiliere: PropTypes.object,
};

export default AddFiliere;
