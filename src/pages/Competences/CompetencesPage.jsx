import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCompetences,
  deleteCompetence,
  addCompetence,
  editCompetence,
} from '../../features/competences/competencesSlice';
import { LoadingSpinner, ErrorAlert, ConfirmModal } from '../../components';
import CompetenceTable from './components/CompetencesTable';
import CompetencesModal from './components/CompetencesModal';
import CompetenceHeader from './components/CompetenceHeader';
import { SearchFilter } from '../../components';
import Pagination from '../../components/shared/Pagination';
import { Filter } from 'lucide-react';
import Papa from 'papaparse';

const CompetencesPage = () => {
  const dispatch = useDispatch();
  const { competences = [], loading, error } = useSelector((state) => state.competences);

  const [modalState, setModalState] = useState({
    isOpen: false,
    viewMode: false,
    selectedCompetence: null,
  });

  const [deleteState, setDeleteState] = useState({
    isOpen: false,
    competenceToDelete: null,
  });

  const [filterState, setFilterState] = useState({
    searchTerm: '',
    selectedFiliere: '',
    selectedModule: '',
    filieres: [],
    modules: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  useEffect(() => {
    dispatch(fetchCompetences());
  }, [dispatch]);

  useEffect(() => {
    const uniqueFilieres = [...new Set(competences.map((comp) => comp.filiere).filter(Boolean))];

    const filteredModules = filterState.selectedFiliere
      ? [
          ...new Set(
            competences
              .filter((comp) => comp.filiere === filterState.selectedFiliere)
              .map((comp) => comp.intitule_module)
              .filter(Boolean)
          ),
        ]
      : [];

    setFilterState((prev) => ({
      ...prev,
      filieres: uniqueFilieres,
      modules: filteredModules,
    }));
  }, [competences, filterState.selectedFiliere]);

  const handleModalOpen = (competence = null, viewMode = false) => {
    setModalState({
      isOpen: true,
      viewMode,
      selectedCompetence: competence,
    });
  };

  const handleModalClose = () => {
    setModalState({
      isOpen: false,
      viewMode: false,
      selectedCompetence: null,
    });
  };

  const handleDeleteClick = (competence) => {
    setDeleteState({
      isOpen: true,
      competenceToDelete: competence,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteCompetence(deleteState.competenceToDelete.id));
      setDeleteState({
        isOpen: false,
        competenceToDelete: null,
      });
    } catch (error) {
      console.error('Error deleting competence:', error);
    }
  };

  const handleSaveCompetence = async (competenceData) => {
    try {
      if (modalState.selectedCompetence) {
        await dispatch(editCompetence(competenceData));
      } else {
        await dispatch(addCompetence(competenceData));
      }
      handleModalClose();
    } catch (error) {
      console.error('Error saving competence:', error);
    }
  };

  const handleExport = () => {
    try {
      const csv = Papa.unparse(competences);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'competences.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting competences:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilterState((prev) => {
      const newState = { ...prev, [key]: value };
      if (key === 'selectedFiliere') {
        newState.selectedModule = '';
      }
      return newState;
    });
    setCurrentPage(1);
  };

  // Fixed filtering logic
  const filteredCompetences = competences.filter((competence) => {
    const { searchTerm, selectedFiliere, selectedModule } = filterState;

    // Safely convert competence title to string and lowercase
    const title = String(competence?.intitule_competence || '').toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();

    const matchesSearch = !searchTerm || title.includes(searchTermLower);
    const matchesFiliere = !selectedFiliere || competence?.filiere === selectedFiliere;
    const matchesModule = !selectedModule || competence?.intitule_module === selectedModule;

    return matchesSearch && matchesFiliere && matchesModule;
  });

  const totalPages = Math.ceil(filteredCompetences.length / ITEMS_PER_PAGE);
  const displayedCompetences = filteredCompetences.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="flex justify-center items-start min-h-screen">
        <LoadingSpinner message="Fetching competences..." />
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
      <CompetenceHeader
        onRefresh={() => dispatch(fetchCompetences())}
        onExport={handleExport}
        onAdd={() => handleModalOpen()}
      />

      <SearchFilter
        searchTerm={filterState.searchTerm}
        filters={[
          {
            key: 'selectedFiliere',
            value: filterState.selectedFiliere,
            options: filterState.filieres,
            placeholder: 'Select Filiere',
          },
          {
            key: 'selectedModule',
            value: filterState.selectedModule,
            options: filterState.modules,
            placeholder: 'Select Module',
          },
        ]}
        onSearchChange={(term) => handleFilterChange('searchTerm', term)}
        onFilterChange={handleFilterChange}
        searchPlaceholder="Rechercher par code ou intitulé..."
        icons={{ SearchIcon: Filter }}
      />

      <hr />

      <CompetenceTable
        competences={displayedCompetences}
        onView={(competence) => handleModalOpen(competence, true)}
        onEdit={(competence) => handleModalOpen(competence, false)}
        onDelete={handleDeleteClick}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      <CompetencesModal
        isOpen={modalState.isOpen}
        mode={modalState.selectedCompetence ? (modalState.viewMode ? 'view' : 'edit') : 'add'}
        competence={modalState.selectedCompetence}
        onClose={handleModalClose}
        onSave={handleSaveCompetence}
      />

      <ConfirmModal
        isOpen={deleteState.isOpen}
        onClose={() => setDeleteState({ isOpen: false, competenceToDelete: null })}
        onConfirm={handleDeleteConfirm}
        title="Supprimer la compétence"
        message={`Êtes-vous sûr de vouloir supprimer la compétence "${deleteState.competenceToDelete?.intitule_competence}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
      />
    </div>
  );
};

export default CompetencesPage;
