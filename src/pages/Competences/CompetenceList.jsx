import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompetences, deleteCompetence } from '../../features/competences/CompetenceSlice';
import { Eye, Edit, Trash } from 'lucide-react';
import AddCompetence from './components/AddCompetence';
import ViewCompetence from './components/ViewCompetence';
import Papa from 'papaparse'; // CSV export functionality
import './CompetenceList.css';

const CompetenceList = () => {
  const dispatch = useDispatch();
  const { competences = [], loading, error } = useSelector((state) => state.competences);
  const [selectedCompetence, setSelectedCompetence] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  return (
    <>
      <div className="container flex justify-between items-center mb-4">
        <button
          onClick={() => {
            setSelectedCompetence(null); // Ensure it's in "Add" mode
            setViewMode(false);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Competence
        </button>
        
        <button
          onClick={handleCSVExport}
          className="bg-yellow-600 text-white px-6 py-2 rounded"
        >
          Export CSV
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
                    <button className="btn btn-info sm" onClick={() => handleView(competence)}>
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="btn btn-success sm" onClick={() => handleEdit(competence)}>
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="btn btn-error sm" onClick={() => handleDelete(competence.id)}>
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

      {/* Tailwind-based modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{viewMode ? 'View Competence' : 'Add Competence'}</h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-800">
                X
              </button>
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
    </>
  );
};

export default CompetenceList;
