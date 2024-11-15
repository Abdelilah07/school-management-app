import React from 'react';
import { Link } from 'react-router-dom';

const ModalGroup = ({ group, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h5 className="text-xl font-semibold">Détails du Groupe</h5>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p>
            <strong>Code Groupe:</strong> {group.codeGroupe}
          </p>
          <p>
            <strong>Niveau:</strong> {group.niveau}
          </p>
          <p>
            <strong>Intitulé Groupe:</strong> {group.intituleGroupe}
          </p>
          <p>
            <strong>Filière:</strong> {group.filiere}
          </p>
          <p>
            <strong>Modules:</strong>{' '}
            <Link
              to={`/modules/${group.codeGroupe}`}
              className="text-blue-600 hover:underline"
            >
              Voir Modules
            </Link>
          </p>
          <p>
            <strong>Emploi du Temps:</strong>{' '}
            <Link
              to={`/emploiDuTemps/${group.codeGroupe}`}
              className="text-blue-600 hover:underline"
            >
              Voir Emploi du Temps
            </Link>
          </p>
          <p>
            <strong>Liste:</strong>{' '}
            <Link
              to={`/liste/${group.codeGroupe}`}
              className="text-blue-600 hover:underline"
            >
              Voir Liste
            </Link>
          </p>
        </div>

        <div className="flex justify-end p-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 focus:outline-none"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalGroup;
