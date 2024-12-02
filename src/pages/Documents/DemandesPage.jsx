import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDemandes, editDemande, deleteDemande } from '../../features/documents/demandeSlice';
import { Edit, Check, Trash, FileText, Clock, X } from 'lucide-react';
import Pagination from '../../components/shared/Pagination';

const DemandesPage = () => {
  const dispatch = useDispatch();
  const { demandes, loading, error } = useSelector((state) => state.demandes);

  useEffect(() => {
    dispatch(fetchDemandes());
  }, [dispatch]);

  const [selectedDocument, setSelectedDocument] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [editedDemande, setEditedDemande] = useState(null);
  const [showModal, setShowModal] = useState(false); // Manage modal visibility
  const [tempStatus, setTempStatus] = useState(''); // Store the selected status temporarily before confirming

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(demandes.length / itemsPerPage);

  const documents = Array.from(new Set(demandes.map((d) => d.document))).sort();
  const availableStatuses = Array.from(new Set(demandes.map((d) => d.status)));

  const handleEdit = (demande) => {
    setEditedDemande(demande);
    setTempStatus(demande.status); // Set temporary status to the current status of the selected demande
    setShowModal(true);
  };

  const handleConfirmEdit = () => {
    if (tempStatus !== editedDemande.status) {
      dispatch(editDemande({ id: editedDemande.id, status: tempStatus }));
    }
    setShowModal(false);
  };

  const handleCancelEdit = () => {
    setShowModal(false);
    setTempStatus(editedDemande.status); // Revert to the original status
  };

  const handleDelete = (demande) => {
    dispatch(deleteDemande(demande.id));
    const newDemandes = demandes.filter((d) => d.id !== demande.id);
    dispatch(fetchDemandes(newDemandes));
  };

  const filteredDemandes = demandes
    .filter((demande) => (selectedDocument ? demande.document === selectedDocument : true))
    .filter((demande) => (selectedStatus ? demande.status === selectedStatus : true));

  return (
    <div className=" min-h-screen py-10">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
        <div className="flex flex-col items-center bg-blue-100 dark:bg-blue-950 dark:text-blue-100 text-blue-800 p-6 rounded-xl shadow-lg filter backdrop-blur-md hover:scale-105 transition-transform">
          <FileText className="h-8 w-8 mb-2" />
          <span className="font-semibold text-lg">Total des demandes</span>
          <span className="text-2xl font-bold">{demandes.length}</span>
        </div>
        <div className="flex flex-col items-center bg-yellow-100 dark:bg-base-300 dark:text-yellow-100 text-yellow-600 p-6 rounded-xl shadow-lg hover:scale-105 transition-transform">
          <Clock className="h-8 w-8 mb-2" />
          <span className="font-semibold text-lg">Demandes en cours</span>
          <span className="text-2xl font-bold">{demandes.filter((d) => d.status === 'en cours').length}</span>
        </div>
        <div className="flex flex-col items-center bg-red-100 dark:bg-red-600 dark:text-red-100 text-red-600 p-6 rounded-xl shadow-lg hover:scale-105 transition-transform">
          <X className="h-8 w-8 mb-2" />
          <span className="font-semibold text-lg">Demandes rejetées</span>
          <span className="text-2xl font-bold">{demandes.filter((d) => d.status === 'rejeter').length}</span>
        </div>
        <div className="flex flex-col items-center bg-green-100 dark:bg-green-600 dark:text-green-100 text-green-600 p-6 rounded-xl shadow-lg hover:scale-105 transition-transform">
          <Check className="h-8 w-8 mb-2" />
          <span className="font-semibold text-lg">Demandes acceptées</span>
          <span className="text-2xl font-bold">{demandes.filter((d) => d.status === 'effectuer').length}</span>
        </div>
      </div>

      {/* Filter Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex mb-4 gap-4">
          <select
            className="select select-primary w-1/2 dark:bg-gray-700 dark:text-white"
            value={selectedDocument}
            onChange={(e) => setSelectedDocument(e.target.value)}
          >
            <option value="">Tous les documents</option>
            {documents.map((document) => (
              <option key={document} value={document}>
                {document}
              </option>
            ))}
          </select>
          <select
            className="select select-primary w-1/2 dark:bg-gray-700 dark:text-white"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            {availableStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Demandes Cards Section (Mobile Version) */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
        {filteredDemandes
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((demande) => (
            <div key={demande.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{demande.document}</h3>
              <p className="text-gray-500 dark:text-gray-400">{demande.user}</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Statut: {demande.status}</p>
              <div className="mt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => handleEdit(demande)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(demande)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Demandes Table Section (Desktop Version) */}
      <div className="hidden container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:block overflow-x-auto ">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-200 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2">Doc</th>
              <th className="px-6 py-2">Stagiaire</th>
              <th className="px-6 py-2">Statut</th>
              <th className="px-6 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDemandes
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((demande) => (
                <tr key={demande.id} className="">
                  <td className="px-4 py-4">{demande.document}</td>
                  <td className="px-6 py-4">{demande.user}</td>
                  <td className="px-6 py-4">{demande.status}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(demande)}
                      className="text-blue-600 dark:text-blue-400"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(demande)}
                      className="ml-4 text-red-600 dark:text-red-400"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="  flex justify-center">
        <Pagination className="mx-4" currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-80">
            <h3 className="text-xl font-semibold mb-4">Modifier le statut</h3>
            <select
              className="select select-primary w-full mb-4 dark:bg-gray-700 dark:text-white"
              value={tempStatus}
              onChange={(e) => setTempStatus(e.target.value)}
            >
              <option value="" disabled selected>Choisir le statut</option>
              <option value="en cours">En Cours</option>
              <option value="effectuer">Effectuer</option>
              <option value="rejeter">Rejeter</option>
            </select>
            <div className="flex gap-4 justify-between">
              <button
                type="button"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                onClick={handleConfirmEdit}
              >
                Confirmer
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                onClick={handleCancelEdit}
              >
                Annuler
              </button>
            </div>
            <div className="absolute top-2 right-2">
              <button onClick={handleCancelEdit}>
                <X className="h-5 w-5 text-gray-500 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemandesPage;
