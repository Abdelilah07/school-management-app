import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompetences, deleteCompetence } from '../../features/competences/CompetenceSlice';
import { Eye, Edit, Trash, Download } from 'lucide-react';
import AddCompetence from './components/AddCompetence';
import ViewCompetence from './components/ViewCompetence';
import Modal from 'react-bootstrap/Modal';
import Papa from 'papaparse'; // CSV export functionality

const CompetenceList = () => {
  const dispatch = useDispatch();
  const { competences = [], loading, error } = useSelector((state) => state.competences);
  const [selectedCompetence, setSelectedCompetence] = useState(null);
  const [viewMode, setViewMode] = useState(false);

  useEffect(() => {
    dispatch(fetchCompetences());
  }, [dispatch]);

  // Delete Competence
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteCompetence(id));
    } catch (err) {
      console.error('Error deleting competence:', err.message);
    }
  };

  // Edit Competence
  const handleEdit = (competence) => {
    setSelectedCompetence(competence);
    setViewMode(false); // Switch to edit mode
  };

  // View Competence
  const handleView = (competence) => {
    setSelectedCompetence(competence);
    setViewMode(true); // Switch to view mode
  };

  // Close Modal
  const handleCloseModal = () => {
    setSelectedCompetence(null);
  };

  // CSV Export
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

  // Show loading state
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  // Show error message
  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleCSVExport}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        <button
          onClick={() => {
            setSelectedCompetence(null);
            setViewMode(false);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Competence
        </button>
      </div>

      <hr />
      <h1 className="text-xl font-semibold">Competences List</h1>

      <div className="overflow-x-auto mt-4">
        <table className="table-auto w-full">
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
            {competences.length > 0 ? (
              competences.map((competence) => (
                <tr key={competence.id}>
                  <td>{competence.code_competence}</td>
                  <td>{competence.intitule_competence.join(' ,')}</td>
                  <td>{competence.intitule_module}</td>
                  <td><a href={competence.cours}>Cours</a></td>
                  <td><a href={competence.quiz}>Quiz</a></td>
                  <td className="flex space-x-2">
                    <button onClick={() => handleView(competence)}>
                      <Eye className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleEdit(competence)}>
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(competence.id)}>
                      <Trash className="w-5 h-5" />
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

      {selectedCompetence && (
        <Modal show={true} onHide={handleCloseModal}>
          {viewMode ? (
            <ViewCompetence competence={selectedCompetence} closeModal={handleCloseModal} />
          ) : (
            <AddCompetence closeModal={handleCloseModal} selectedCompetence={selectedCompetence} />
          )}
        </Modal>
      )}
    </>
  );
};

export default CompetenceList;
