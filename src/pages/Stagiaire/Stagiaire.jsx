import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchStagiaires,
  selectStagiaires,
  selectStatus,
  selectError,
  setFiliereFilter,
  setGroupeFilter,
  addStagiaireAPI,
  deleteStagiaireAPI,
  updateStagiaireAPI,
  clearError,
} from '../../features/Stagiaire/stagiaireSlice';
import Modal from 'react-modal';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { Plus, Edit, Trash2, Download, FileSpreadsheet } from 'lucide-react';

Modal.setAppElement('#root');

const ITEMS_PER_PAGE = 5;
const INITIAL_STAGIAIRE = {
  cef: '',
  nom: '',
  prenom: '',
  email: '',
  filiere: '',
  groupe: '',
};

const GROUP_OPTIONS = ['G101', 'G102'];

const Stagiaire = () => {
  const dispatch = useDispatch();
  const stagiaires = useSelector(selectStagiaires);
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);

  const [filters, setFilters] = useState({
    filiere: '',
    groupe: '',
    searchTerm: '',
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    stagiaire: INITIAL_STAGIAIRE,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  useEffect(() => {
    dispatch(fetchStagiaires());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Derived state
  const filiereOptions = [...new Set(stagiaires.map((s) => s.filiere))];
  const filteredStagiaires = getFilteredStagiaires(stagiaires, filters);
  const totalPages = Math.ceil(filteredStagiaires.length / pagination.itemsPerPage);
  const displayedStagiaires = filteredStagiaires.slice(
    (pagination.currentPage - 1) * pagination.itemsPerPage,
    pagination.currentPage * pagination.itemsPerPage
  );

  // Filter handlers
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));

    if (filterType === 'filiere') {
      dispatch(setFiliereFilter(value));
    } else if (filterType === 'groupe') {
      dispatch(setGroupeFilter(value));
    }
  };

  // Modal handlers
  const handleModalOpen = (stagiaire = INITIAL_STAGIAIRE) => {
    setModalState({
      isOpen: true,
      stagiaire: { ...stagiaire },
    });
  };

  const handleModalClose = () => {
    setModalState({
      isOpen: false,
      stagiaire: INITIAL_STAGIAIRE,
    });
    dispatch(clearError());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalState((prev) => ({
      ...prev,
      stagiaire: { ...prev.stagiaire, [name]: value },
    }));
  };

  // CRUD operations
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { stagiaire } = modalState;

    try {
      if (stagiaire.cef) {
        await dispatch(updateStagiaireAPI(stagiaire)).unwrap();
      } else {
        await dispatch(addStagiaireAPI(stagiaire)).unwrap();
      }
      handleModalClose();
    } catch (err) {
      console.error('Operation failed:', err);
    }
  };

  const handleDelete = async (cef) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce stagiaire ?')) {
      try {
        await dispatch(deleteStagiaireAPI(cef)).unwrap();
        console.log(cef);
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  // Export functions
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredStagiaires);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stagiaires');
    XLSX.writeFile(wb, 'stagiaires.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Liste des Stagiaires', 10, 10);
    displayedStagiaires.forEach((stagiaire, index) => {
      const text = `${stagiaire.cef} - ${stagiaire.nom} ${stagiaire.prenom}`;
      doc.text(text, 10, 20 + index * 10);
    });
    doc.save('stagiaires.pdf');
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-4">
      {error &&
        (console.error('Error:', error), alert("Une erreur s'est produite lors de l'opération."))}

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <button
          onClick={() => handleModalOpen()}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> Ajouter Stagiaire
        </button>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Rechercher"
            className="input"
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          />
          <select
            value={filters.filiere}
            onChange={(e) => handleFilterChange('filiere', e.target.value)}
            className="input"
          >
            <option value="">Toutes les filières</option>
            {filiereOptions.map((filiere) => (
              <option key={filiere} value={filiere}>
                {filiere}
              </option>
            ))}
          </select>
          <select
            value={filters.groupe}
            onChange={(e) => handleFilterChange('groupe', e.target.value)}
            className="input"
          >
            <option value="">Tous les groupes</option>
            {GROUP_OPTIONS.map((groupe) => (
              <option key={groupe} value={groupe}>
                {groupe}
              </option>
            ))}
          </select>
        </div>

        {/* Export buttons */}
        <div className="flex gap-2">
          <button onClick={exportToExcel} className="btn btn-outline flex items-center gap-2">
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button onClick={exportToPDF} className="btn btn-outline flex items-center gap-2">
            <Download size={16} /> PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2">CEF</th>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Prénom</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Filière</th>
              <th className="px-4 py-2">Groupe</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedStagiaires.map((stagiaire) => (
              <tr key={stagiaire.cef} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{stagiaire.cef}</td>
                <td className="px-4 py-2">{stagiaire.nom}</td>
                <td className="px-4 py-2">{stagiaire.prenom}</td>
                <td className="px-4 py-2">{stagiaire.email}</td>
                <td className="px-4 py-2">{stagiaire.filiere}</td>
                <td className="px-4 py-2">{stagiaire.groupe}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => handleModalOpen(stagiaire)} className="btn btn-warning">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(stagiaire.cef)} className="btn btn-danger">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className="btn btn-outline"
        >
          Précédent
        </button>
        <span>
          Page {pagination.currentPage} sur {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === totalPages}
          className="btn btn-outline"
        >
          Suivant
        </button>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onRequestClose={handleModalClose}
        className="bg-white w-full max-w-md mx-auto rounded-lg shadow-lg p-6 mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {modalState.stagiaire.cef ? 'Modifier' : 'Ajouter'} un Stagiaire
            </h2>
            <button
              type="button"
              onClick={handleModalClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          {['cef', 'nom', 'prenom', 'email', 'filiere', 'groupe'].map((field) => (
            <div key={field} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                name={field}
                value={modalState.stagiaire[field]}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          ))}

          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={handleModalClose} className="btn btn-secondary">
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              {modalState.stagiaire.cef ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// Utility function for filtering
function getFilteredStagiaires(stagiaires, filters) {
  return stagiaires.filter((stagiaire) => {
    const isFiliereMatch = !filters.filiere || stagiaire.filiere === filters.filiere;
    const isGroupeMatch = !filters.groupe || stagiaire.groupe === filters.groupe;
    const isSearchMatch =
      !filters.searchTerm ||
      stagiaire.nom.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      stagiaire.prenom.toLowerCase().includes(filters.searchTerm.toLowerCase());
    return isFiliereMatch && isGroupeMatch && isSearchMatch;
  });
}

export default Stagiaire;
