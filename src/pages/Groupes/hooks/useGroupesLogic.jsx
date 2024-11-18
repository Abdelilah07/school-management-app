
import { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { addGroupe, deleteGroupe, editGroupe } from '../../../features/groupes/GroupesSlice';

export const useGroupesLogic = (groups) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupeToDelete, setgroupeToDelete] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [selectedGroupe, setSelectedGroupe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNiveau, setfilterNiveau] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'code_filiere', direction: 'asc' });

  const filteredAndSortedGroupes = useMemo(() => {
    return groups
      .filter((group) => {
        const matchesSearch =
          group.codeGroupe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.intituleGroupe?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSector = !filterNiveau || group.niveau === filterNiveau;
        return matchesSearch && matchesSector;
      })
      .sort((a, b) => {
        if (sortConfig.key) {
          const aValue = a[sortConfig.key] || '';
          const bValue = b[sortConfig.key] || '';
          return (
            (sortConfig.direction === 'asc' ? 1 : -1) *
            (aValue > bValue ? 1 : aValue < bValue ? -1 : 0)
          );
        }
        return 0;
      });
  }, [groups, searchTerm, filterNiveau, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleNiveauFilter = (sector) => {
    setfilterNiveau(sector);
  };

  const handleModalOpen = (group, mode) => {
    setSelectedGroupe(group);
    setViewMode(mode === 'view');
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedGroupe(null);
    setViewMode(false);
  };

  const handleDeleteClick = (group) => {
    setgroupeToDelete(group);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setgroupeToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!groupeToDelete) return;

    try {
      await dispatch(deleteGroupe(groupeToDelete.id)).unwrap();
      setIsDeleteModalOpen(false);
      setgroupeToDelete(null);
      handleModalClose(); // Close the view modal if open
    } catch (error) {
      console.error('Failed to delete groupe:', error);
      alert('Erreur lors de la suppression du groupe');
    }
  };

  const handleSave = async (groupeData) => {
    try {
      if (groupeData.id) {
        await dispatch(editGroupe(groupeData)).unwrap();
      } else {
        await dispatch(addGroupe(groupeData)).unwrap();
      }
      handleModalClose();
    } catch (error) {
      console.error('Failed to save groupe:', error);
      throw new Error("Erreur lors de l'enregistrement du groupe");
    }
  };

  const exportGroupes = () => {
    const headers = ['Code Groupe','Niveau', 'Intitule groupe', 'filiere', 'Modules', 'EmploiDuTemps', 'liste'];
    const rows = filteredAndSortedGroupes.map((group) => [
      group.codeGroupe,
      group.niveau,
      group.intituleGroupe,
      group.filiere,
      Array.isArray(group.modules) ? group.modules.join(';') : '',
      group.emploiDuTemps,
      Array.isArray(group.liste) ? group.liste.join(';') : '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `groupes_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return {
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
  };
};
