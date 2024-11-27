import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaRegFileExcel, FaFilePdf } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa6';
import { setFormateurs, setSelectedSecteur } from '../../features/formateur/formateurSlice';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Formateur = () => {
  const dispatch = useDispatch();
  const { formateurs, selectedSecteur } = useSelector((state) => state.formateurs);

  const [isShareMenuVisible, setShareMenuVisible] = useState(false);
  const [selectedFormateur, setSelectedFormateur] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modules, setModules] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/json/db.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const data = await response.json();
        dispatch(setFormateurs(data.formateurs));
      } catch (error) {
        console.error('Error fetching data:', error.message);
        alert('Erreur lors du chargement des données des formateurs.');
      }
    };
    fetchData();
  }, [dispatch]);

  const filteredFormateurs = selectedSecteur
    ? formateurs.filter((formateur) => formateur.secteur === selectedSecteur)
    : [];

  const totalPages = Math.ceil(filteredFormateurs.length / itemsPerPage);

  const paginatedFormateurs = filteredFormateurs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSecteurChange = (e) => {
    dispatch(setSelectedSecteur(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleToggleModal = (formateur) => {
    setModules(formateur.modules);
    setSelectedFormateur(formateur);
    setShowModal(!showModal);
  };

  const exportToPDF = (modules, formateurName) => {
    const doc = new jsPDF();
    doc.text(`Modules de ${formateurName}`, 10, 10);
    autoTable(doc, {
      head: [['Code', 'Intitulé', 'MH Synthese', 'MH P', 'MH Total']],
      body: modules.map((module) => [
        module.code,
        module.intitule,
        module.mhSynthese,
        module.mhP,
        module.mhTotal,
      ]),
    });
    doc.save(`Modules_${formateurName}.pdf`);
  };

  const exportToExcel = (modules, formateurName) => {
    const worksheet = XLSX.utils.json_to_sheet(modules);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Modules');
    XLSX.writeFile(workbook, `Modules_${formateurName}.xlsx`);
  };

  const handleShareClick = (formateur) => {
    setSelectedFormateur(formateur);
    setShareMenuVisible(!isShareMenuVisible);
  };

  const handleExportOption = (format) => {
    if (format === 'pdf' && selectedFormateur) {
      exportToPDF(selectedFormateur.modules, selectedFormateur.nom);
    } else if (format === 'excel' && selectedFormateur) {
      exportToExcel(selectedFormateur.modules, selectedFormateur.nom);
    }
    setShareMenuVisible(false);
  };

  return (
    <div className="p-4 mx-auto min-h-screen bg-white text-black">
      <h1 className="text-center text-xl font-bold">FORMATEURS :</h1>

      <div className="mb-4">
        <label htmlFor="secteur" className="block text-lg font-medium">
          Secteur :
        </label>
        <select
          value={selectedSecteur}
          onChange={handleSecteurChange}
          className="block w-full px-3 py-2 border rounded-lg text-lg"
        >
          <option value="">-- Sélectionnez un secteur --</option>
          <option value="Digital">Digital</option>
          <option value="Agro-alimentaire">Agro-alimentaire</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
        </select>
      </div>

      {selectedSecteur === '' ? (
        <div className="p-4 rounded-md text-center bg-yellow-100 text-yellow-700">
          Veuillez sélectionner un secteur pour afficher les formateurs.
        </div>
      ) : (
        <>
          <table className="min-w-full mb-4 rounded-lg shadow-md bg-white text-gray-700 border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-6 py-3 border-b">ID</th>
                <th className="px-6 py-3 border-b">Nom</th>
                <th className="px-6 py-3 border-b">Prénom</th>
                <th className="px-6 py-3 border-b">Secteur</th>
                <th className="px-6 py-3 border-b">Modules</th>
                <th className="px-6 py-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFormateurs.map((formateur) => (
                <tr key={formateur.id} className="bg-white text-gray-700">
                  <td className="px-6 py-3 border-b">{formateur.id}</td>
                  <td className="px-6 py-3 border-b">{formateur.nom}</td>
                  <td className="px-6 py-3 border-b">{formateur.prenom}</td>
                  <td className="px-6 py-3 border-b">{formateur.secteur}</td>
                  <td className="px-6 py-3 border-b text-center">
                    <button
                      onClick={() => handleToggleModal(formateur)}
                      className="btn btn-primary px-4 py-2 rounded-md text-white"
                    >
                      Voir Modules
                    </button>
                  </td>
                  <td className="px-6 py-3 border-b text-center">
                    <button
                      onClick={() => handleShareClick(formateur)}
                      className="px-4 py-2 rounded-md text-white bg-yellow-500 hover:bg-yellow-600"
                    >
                      <FaDownload className="text-xl" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 mx-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && selectedFormateur && modules.length > 0 && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
            <h2 className="text-lg font-bold mb-4">Modules de {selectedFormateur.nom}</h2>
            <table className="min-w-full mb-4">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b">Code</th>
                  <th className="px-6 py-3 border-b">Intitulé</th>
                  <th className="px-6 py-3 border-b">MH Synthese</th>
                  <th className="px-6 py-3 border-b">MH P</th>
                  <th className="px-6 py-3 border-b">MH Total</th>
                </tr>
              </thead>
              <tbody>
                {modules.map((module) => (
                  <tr key={module.code}>
                    <td className="px-6 py-3 border-b">{module.code}</td>
                    <td className="px-6 py-3 border-b">{module.intitule}</td>
                    <td className="px-6 py-3 border-b">{module.mhSynthese}</td>
                    <td className="px-6 py-3 border-b">{module.mhP}</td>
                    <td className="px-6 py-3 border-b">{module.mhTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Menu */}
      {isShareMenuVisible && selectedFormateur && (
        <div className="absolute right-10 top-1/4 bg-white shadow-md p-4 rounded-md w-48">
          <button
            onClick={() => handleExportOption('pdf')}
            className="flex items-center px-4 py-2 w-full text-black hover:bg-gray-200"
          >
            <FaFilePdf className="mr-2" /> PDF
          </button>
          <button
            onClick={() => handleExportOption('excel')}
            className="flex items-center px-4 py-2 w-full text-black hover:bg-gray-200"
          >
            <FaRegFileExcel className="mr-2 " /> Excel
          </button>
        </div>
      )}
    </div>
  );
};

export default Formateur;
