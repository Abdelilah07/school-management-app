import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompetences, deleteCompetence } from '../../features/competences/CompetenceSlice';
import { Eye, Edit, Trash, AlertCircle, Download, Plus, Search } from 'lucide-react';
import AddCompetence from './components/AddCompetence';
import ViewCompetence from './components/ViewCompetence';
import Papa from 'papaparse';

const CompetenceList = () => {
  const dispatch = useDispatch();
  const { competences = [], loading, error } = useSelector((state) => state.competences);
  const [selectedCompetence, setSelectedCompetence] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(competences.length / itemsPerPage);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchCompetences());
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteCompetence(id));
    } catch (err) {
      console.error('Error deleting competence:', err.message);
    }
  };

  const handleEdit = (competence) => {
    setSelectedCompetence(competence);
    setViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (competence) => {
    setSelectedCompetence(competence);
    setViewMode(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCompetence(null);
    setIsModalOpen(false);
  };

  const handleCSVExport = () => {
    const csv = Papa.unparse(competences);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'competences.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredCompetences = competences.filter((competence) =>
    competence.intitule_competence.some((name) =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const displayedCompetences = filteredCompetences.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <AlertCircle className="h-6 w-6" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Element de Competence</h1>
      
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search competences..."
          className="input input-bordered w-full pl-10"
        />
      </div>

      <div className="flex justify-between items-center mb-6">
        <button onClick={() => { setSelectedCompetence(null); setViewMode(false); setIsModalOpen(true); }} className="btn btn-primary gap-2">
          <Plus className="w-5 h-5" /> Add Competence
        </button>
        <button onClick={handleCSVExport} className="btn btn-accent gap-2">
          <Download className="w-5 h-5" /> Export CSV
        </button>
      </div>

      <hr />
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Code</th>
              <th>Intitulé Competence</th>
              <th>Intitulé Module</th>
              <th>Cours</th>
              <th>Quiz</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedCompetences.length > 0 ? (
              displayedCompetences.map((competence) => (
                <tr key={competence.id}>
                  <td>{competence.code_competence}</td>
                  <td>{competence.intitule_competence.join(', ')}</td>
                  <td>{competence.intitule_module}</td>
                  <td><a href={competence.cours}>Cours</a></td>
                  <td><a href={competence.quiz}>Quiz</a></td>
                  <td className="flex gap-2">
                    <button className="btn btn-info btn-sm" onClick={() => handleView(competence)}>
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="btn btn-success btn-sm" onClick={() => handleEdit(competence)}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="btn btn-error btn-sm" onClick={() => handleDelete(competence.id)}>
                      <Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No competences available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button onClick={goToPreviousPage} disabled={currentPage === 1} className="btn btn-secondary">
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages} className="btn btn-secondary">
          Next
        </button>
      </div>

      {isModalOpen && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-80 p-4 max-h-[500px] overflow-y-auto"> 
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{viewMode ? 'View Competence' : 'Add Competence'}</h2>
            <button onClick={handleCloseModal} className="text-gray-200 hover:text-gray-300">X</button>
          </div>
          <div className="mt-4">
            {viewMode ? (
              <ViewCompetence competence={selectedCompetence} closeModal={handleCloseModal} />
            ) : (
              <AddCompetence closeModal={handleCloseModal} selectedCompetence={selectedCompetence} />
            )}
          </div>
        </div>
      </div>
    )}


    </div>
  );
};

export default CompetenceList;
