// src/pages/Filieres/FilieresPage.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFilieres } from '../../features/filieres/filieresSlice';
import FilieresTable from './components/FilieresTable';
import FilieresHeader from './components/FilieresHeader';
import FilieresSearch from './components/FilieresSearch';
import FilieresModal from './components/FilieresModal';
import { LoadingSpinner, ErrorAlert, ConfirmModal } from '../../components';
import { useFilieresLogic } from './hooks/useFilieresLogic';

const FilieresPage = () => {
  const dispatch = useDispatch();
  const { filieres, loading, error } = useSelector((state) => state.filieres);
  const {
    isModalOpen,
    isDeleteModalOpen,
    filiereToDelete,
    viewMode,
    selectedFiliere,
    searchTerm,
    filterSecteur,
    sortConfig,
    filteredAndSortedFilieres,
    handleSort,
    handleSearch,
    handleSectorFilter,
    handleModalOpen,
    handleModalClose,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    handleSave,
    exportFilieres,
  } = useFilieresLogic(filieres);

  useEffect(() => {
    dispatch(fetchFilieres());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchFilieres());
  };

  if (loading)
    return (
      <div className="flex justify-center items-start min-h-screen">
        <LoadingSpinner message="Chargement des filières..." />
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-start min-h-screen">
        <ErrorAlert message={error} />
      </div>
    );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <FilieresHeader
        onRefresh={handleRefresh}
        onExport={exportFilieres}
        onAdd={() => handleModalOpen(null, 'edit')}
      />

      <FilieresSearch
        searchTerm={searchTerm}
        filterSecteur={filterSecteur}
        sectors={[...new Set(filieres.map((f) => f.secteur))]}
        onSearchChange={handleSearch}
        onSectorChange={handleSectorFilter}
      />

      <FilieresTable
        filieres={filteredAndSortedFilieres}
        sortConfig={sortConfig}
        onSort={handleSort}
        onView={(filiere) => handleModalOpen(filiere, 'view')}
        onEdit={(filiere) => handleModalOpen(filiere, 'edit')}
        onDelete={handleDeleteClick}
      />

      <FilieresModal
        isOpen={isModalOpen}
        mode={viewMode ? 'view' : 'edit'}
        filiere={selectedFiliere}
        onClose={handleModalClose}
        onSave={handleSave}
        onDelete={handleDeleteClick}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Supprimer la filière"
        message={`Êtes-vous sûr de vouloir supprimer la filière "${filiereToDelete?.intitule_filiere}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
      />
    </div>
  );
};

export default FilieresPage;
