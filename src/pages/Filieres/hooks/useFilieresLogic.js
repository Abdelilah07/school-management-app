// src/pages/Filieres/hooks/useFilieresLogic.js
import { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { deleteFiliere, editFiliere, addFiliere } from '../../../features/filieres/filieresSlice';

export const useFilieresLogic = (filieres) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filiereToDelete, setFiliereToDelete] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [selectedFiliere, setSelectedFiliere] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSecteur, setFilterSecteur] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'code_filiere', direction: 'asc' });

  const filteredAndSortedFilieres = useMemo(() => {
    return filieres
      .filter((filiere) => {
        const matchesSearch =
          filiere.code_filiere?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          filiere.intitule_filiere?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSector = !filterSecteur || filiere.secteur === filterSecteur;
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
  }, [filieres, searchTerm, filterSecteur, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSectorFilter = (sector) => {
    setFilterSecteur(sector);
  };

  const handleModalOpen = (filiere, mode) => {
    setSelectedFiliere(filiere);
    setViewMode(mode === 'view');
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedFiliere(null);
    setViewMode(false);
  };

  const handleDeleteClick = (filiere) => {
    setFiliereToDelete(filiere);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setFiliereToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!filiereToDelete) return;

    try {
      await dispatch(deleteFiliere(filiereToDelete.id)).unwrap();
      setIsDeleteModalOpen(false);
      setFiliereToDelete(null);
      handleModalClose(); // Close the view modal if open
    } catch (error) {
      console.error('Failed to delete filiere:', error);
      alert('Erreur lors de la suppression de la filière');
    }
  };

  const handleSave = async (filiereData) => {
    try {
      if (filiereData.id) {
        await dispatch(editFiliere(filiereData)).unwrap();
      } else {
        await dispatch(addFiliere(filiereData)).unwrap();
      }
      handleModalClose();
    } catch (error) {
      console.error('Failed to save filiere:', error);
      throw new Error("Erreur lors de l'enregistrement de la filière");
    }
  };

  const exportFilieres = () => {
    const headers = ['Code Filiere', 'Intitule Filiere', 'Secteur', 'Groupes'];
    const rows = filteredAndSortedFilieres.map((filiere) => [
      filiere.code_filiere,
      filiere.intitule_filiere,
      filiere.secteur,
      Array.isArray(filiere.groupes) ? filiere.groupes.join(';') : '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `filieres_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return {
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
  };
};
