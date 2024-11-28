import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingSpinner, ErrorAlert, ConfirmModal } from '../../components';
import GroupesHeader from './components/GroupesHeader';
import GroupesSearch from './components/GroupesSearch';
import { useGroupesLogic } from './hooks/useGroupesLogic';
import GroupesTable from './components/GroupesTable';
import GroupesModal from './components/GroupesModal';
import { fetchGroupes } from '../../features/Groupes/GroupesSlice';

const GroupesPage = () => {
  const dispatch = useDispatch();
  const { groups, loading, error } = useSelector((state) => state.groups);
  const {
    isModalOpen,
    isDeleteModalOpen,
    groupeToDelete,
    viewMode,
    selectedGroupe,
    searchTerm,
    filterNiveau,
    sortConfig,
    filteredAndSortedGroupes,
    handleSort,
    handleSearch,
    handleNiveauFilter,
    handleModalOpen,
    handleModalClose,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    handleSave,
    exportGroupes,
  } = useGroupesLogic(groups);

  useEffect(() => {
    dispatch(fetchGroupes());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchGroupes());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-start min-h-screen">
        <LoadingSpinner message="Chargement des groupes..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-start min-h-screen">
        <ErrorAlert message={error} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <GroupesHeader
        onRefresh={handleRefresh}
        onExport={exportGroupes}
        onAdd={() => handleModalOpen(null, 'edit')}
      />

      <GroupesSearch
        searchTerm={searchTerm}
        filterNiveau={filterNiveau}
        niveaux={[...new Set(groups.map((g) => g.niveau))]}
        onSearchChange={handleSearch}
        onSectorChange={handleNiveauFilter}
      />

      <GroupesTable
        groups={filteredAndSortedGroupes}
        sortConfig={sortConfig}
        onSort={handleSort}
        onView={(group) => handleModalOpen(group, 'view')}
        onEdit={(group) => handleModalOpen(group, 'edit')}
        onDelete={handleDeleteClick}
      />

      <GroupesModal
        isOpen={isModalOpen}
        mode={viewMode ? 'view' : 'edit'}
        group={selectedGroupe}
        onClose={handleModalClose}
        onSave={handleSave}
        onDelete={handleDeleteClick}
        groupCount={groups.length}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Supprimer le groupe"
        message={`Êtes-vous sûr de vouloir supprimer le groupe "${groupeToDelete?.intituleGroupe}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
      />
    </div>
  );
};

export default GroupesPage;
