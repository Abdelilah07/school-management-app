import { useDispatch } from 'react-redux';
import { addGroupAPI } from './groupsSlice';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const AddGroup = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    codeGroupe: '',
    niveau: '',
    intituleGroupe: '',
    filiere: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.codeGroupe && formData.niveau && formData.intituleGroupe && formData.filiere) {
      try {
        await dispatch(addGroupAPI(formData)).unwrap();
        onClose(); // Close modal after adding the group
        navigate('/');
      } catch (error) {
        console.error("Erreur lors de l'ajout:", error);
        alert("Une erreur est survenue lors de l'ajout du groupe.");
      }
    } else {
      alert('Veuillez remplir tous les champs !');
    }
  };

  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h5 className="text-xl font-semibold">Ajouter un Groupe</h5>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✕
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="codeGroupe" className="block text-sm font-medium text-gray-700">
                Code Groupe
              </label>
              <input
                type="text"
                id="codeGroupe"
                name="codeGroupe"
                value={formData.codeGroupe}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="niveau" className="block text-sm font-medium text-gray-700">
                Niveau
              </label>
              <input
                type="text"
                id="niveau"
                name="niveau"
                value={formData.niveau}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="intituleGroupe" className="block text-sm font-medium text-gray-700">
                Intitulé Groupe
              </label>
              <input
                type="text"
                id="intituleGroupe"
                name="intituleGroupe"
                value={formData.intituleGroupe}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="filiere" className="block text-sm font-medium text-gray-700">
                Filière
              </label>
              <input
                type="text"
                id="filiere"
                name="filiere"
                value={formData.filiere}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
              >
                Ajouter
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddGroup;
