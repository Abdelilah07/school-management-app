import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchsecteurs } from '../../features/secteur/secteurslice';
import SecteursTable from './components/SecteursTable';
import SecteursHeader from './components/SecteursHeader';
import SecteursModal from './components/SecteursModal';
import { useSecteursLogic } from './hooks/useSecteursLogic';

const SecteursPage = () => {
  const dispatch = useDispatch();
  const secteurs = useSelector((state) => state.secteur.secteurs);
  const loading = useSelector((state) => state.secteur.loading);
  const error = useSelector((state) => state.secteur.error);

  const {
    secteurToDelete,
    isDeleteModalOpen,
    isModalOpen,
    selectedSecteur,
    viewMode,
    handleModalOpen,
    handleModalClose,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleSave,
    handleSearch,
    handleSort,
    sortConfig,
    handleFilterChange,
    exportSecteurs,
    filteredAndSortedSecteurs,
  } = useSecteursLogic(secteurs);

  useEffect(() => {
    dispatch(fetchsecteurs());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchsecteurs());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <SecteursHeader
        onRefresh={handleRefresh}
        onExport={exportSecteurs}
        onAdd={() => handleModalOpen(null, 'edit')}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />

      <SecteursTable
        secteurs={filteredAndSortedSecteurs}
        onSort={handleSort}
        sortConfig={sortConfig}
        onView={(secteur) => handleModalOpen(secteur, 'view')}
        onEdit={(secteur) => handleModalOpen(secteur, 'edit')}
        onDelete={handleDeleteClick}
      />

      <SecteursModal
        isOpen={isModalOpen}
        mode={viewMode ? 'view' : 'edit'}
        secteur={selectedSecteur}
        onClose={handleModalClose}
        onSave={handleSave}
        onDelete={handleDeleteClick}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirmer la suppression</h3>
            <p className="py-4">
              Êtes-vous sûr de vouloir supprimer ce secteur ? Cette action est irréversible.
            </p>
            <div className="modal-action">
              <button onClick={handleDeleteCancel} className="btn">
                Annuler
              </button>
              <button onClick={handleDeleteConfirm} className="btn btn-error">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecteursPage;
