import React, { useState, useEffect } from 'react';

const EditGroupModal = ({ group, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    codeGroupe: '',
    niveau: '',
    intituleGroupe: '',
    filiere: '',
  });

  useEffect(() => {
    if (group) {
      setFormData({
        id:group.id,
        codeGroupe: group.codeGroupe,
        niveau: group.niveau,
        intituleGroupe: group.intituleGroupe,
        filiere: group.filiere,
      });
    }
  }, [group]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h5 className="text-xl font-semibold">Modifier le groupe</h5>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Code Groupe */}
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

            {/* Niveau */}
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

            {/* Intitulé Groupe */}
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

            {/* Filière */}
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

            {/* Bouton Mettre à jour */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
              >
                Mettre à jour
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditGroupModal;
