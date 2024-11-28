
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTrainees,
  addTraineeAPI,
  updateTraineeAPI,
  deleteTraineeAPI,
  selectTrainees,
  selectStatus,
  selectError,
} from '../../features/trainees/traineesSlice';
import { Plus, Edit, Trash2, Download, FileSpreadsheet, AlertCircle, CheckCircle, X, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Pagination from '../../components/shared/Pagination';

const INITIAL_STAGIAIRE = {
  cef: '',
  nom: '',
  prenom: '',
  email: '',
  annee: '',
  niveau: '',
  filiere: '',
  groupe: '',
};

const TraineesPage = () => {
  const dispatch = useDispatch();
  const trainees = useSelector(selectTrainees);
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3;
  const [modalState, setModalState] = useState({ isOpen: false, trainee: INITIAL_STAGIAIRE });
  const [filters, setFilters] = useState({ filiere: '', groupe: '', searchTerm: '' });
  const [alerts, setAlerts] = useState({ success: null, error: null });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTrainees());
    }
  }, [status, dispatch]);

  const handleModalOpen = (trainee = INITIAL_STAGIAIRE) => {
    setModalState({ isOpen: true, trainee: { ...trainee } });
  };

  const handleModalClose = () => {
    setModalState({ isOpen: false, trainee: INITIAL_STAGIAIRE });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { trainee } = modalState;

    try {
      const isDuplicate = trainees.some(s =>
        s.cef === trainee.cef && s.id !== trainee.id
      );
      if (isDuplicate) {
        setAlerts({ success: null, error: 'Un trainee avec ce CEF existe déjà.' });
        return;
      }

      if (trainee.id) {
        await dispatch(updateTraineeAPI(trainee)).unwrap();
        setAlerts({ success: 'Trainee mis à jour avec succès.', error: null });
      } else {
        await dispatch(addTraineeAPI(trainee)).unwrap();
        setAlerts({ success: 'Trainee ajouté avec succès.', error: null });
      }
      handleModalClose();
    } catch (err) {
      setAlerts({ success: null, error: `Opération échouée : ${err.message}` });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trainee?')) {
      try {
        await dispatch(deleteTraineeAPI(id)).unwrap();
        setAlerts({ success: 'Trainee deleted successfully', error: null });
      } catch (err) {
        setAlerts({ success: null, error: `Delete failed: ${err.message}` });
      }
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(trainees);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Trainees');
    XLSX.writeFile(wb, 'trainees.xlsx');
  };

  const exportToPDF = async () => {
    const doc = new jsPDF();
    const logoURL = 'https://th.bing.com/th/id/OIP.Sb1FiwDyjsY5DePGcoEAwwHaHa?rs=1&pid=ImgDetMain'; // Chemin vers le logo (assurez-vous qu'il est placé dans `public`)
    const label = 'Liste des trainees';

    // Ajouter le logo
    const img = new Image();
    img.src = logoURL;

    img.onload = () => {
      const imgWidth = 20; // Largeur de l'image dans le PDF
      const imgHeight = (img.height * imgWidth) / img.width; // Calculer la hauteur proportionnelle

      doc.addImage(img, 'URL', 10, 10, imgWidth, imgHeight); // Ajouter le logo

      // Ajouter le label
      doc.setFontSize(18);
      doc.text(label, imgWidth + 30, 25);

      // Ajouter un espace avant le tableau
      doc.setFontSize(12);
      doc.autoTable({
        startY: imgHeight + 20, // Positionner le tableau sous le logo et le label
        head: [['CEF', 'Nom', 'Prénom', 'Email', 'Année', 'Niveau', 'Filière', 'Groupe']],
        body: trainees.map((s) => [
          s.cef,
          s.nom,
          s.prenom,
          s.email,
          s.annee,
          s.niveau,
          s.filiere,
          s.groupe,
        ]),
      });

      // Enregistrer le PDF
      doc.save('trainees.pdf');
    };

    img.onerror = () => {
      console.error('Erreur lors du chargement du logo. Vérifiez le chemin du fichier.');
      setAlerts({ success: null, error: 'Erreur lors de la génération du PDF.' });
    };
  };


  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const csvData = event.target.result;
        const lines = csvData.split('\n');
        const headers = lines[0].split(',');
        const newTrainees = [];
        const duplicates = [];

        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() !== '') {
            const values = lines[i].split(',');
            const trainee = {};
            headers.forEach((header, index) => {
              trainee[header.toLowerCase().trim()] = values[index].trim();
            });

            // Check for duplication
            const isDuplicate = trainees.some(s =>
              (trainee.id && s.id === trainee.id) || s.cef === trainee.cef
            );

            if (isDuplicate) {
              duplicates.push(trainee.cef || trainee.id);
            } else {
              newTrainees.push(trainee);
            }
          }
        }

        try {
          for (const trainee of newTrainees) {
            await dispatch(addTraineeAPI(trainee)).unwrap();
          }

          if (duplicates.length > 0) {
            setAlerts({
              success: `${newTrainees.length} trainees imported successfully. ${duplicates.length} duplicates were skipped.`,
              error: `Skipped duplicates: ${duplicates.join(', ')}`
            });
          } else {
            setAlerts({ success: `${newTrainees.length} trainees imported successfully`, error: null });
          }

          dispatch(fetchTrainees());
        } catch (err) {
          setAlerts({ success: null, error: `Import failed: ${err.message}` });
        }
      };
      reader.readAsText(file);
    }
  };

  const filteredTrainees = useMemo(() => {
    return Array.isArray(trainees) ? trainees.filter(s =>
      (s.nom?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        s.prenom?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        s.cef?.toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
      (!filters.filiere || s.filiere === filters.filiere) &&
      (!filters.groupe || s.groupe === filters.groupe)
    ) : [];
  }, [trainees, filters]);

  const totalPages = Math.ceil(filteredTrainees.length / ITEMS_PER_PAGE);
  const displayedTrainees = filteredTrainees.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const uniqueFilieres = useMemo(() => {
    return Array.from(new Set(trainees.map(s => s.filiere))).filter(Boolean);
  }, [trainees]);

  const uniqueGroupes = useMemo(() => {
    return Array.from(new Set(trainees.map(s => s.groupe))).filter(Boolean);
  }, [trainees]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des Trainees</h1>

      {alerts.success && (
        <div className="alert alert-success mb-4">
          <CheckCircle className="w-6 h-6" />
          <span>{alerts.success}</span>
          <button onClick={() => setAlerts({ ...alerts, success: null })} className="btn btn-circle btn-outline btn-sm">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {alerts.error && (
        <div className="alert alert-error mb-4">
          <AlertCircle className="w-6 h-6" />
          <span>{alerts.error}</span>
          <button onClick={() => setAlerts({ ...alerts, error: null })} className="btn btn-circle btn-outline btn-sm">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex justify-between mb-4">
        <button onClick={() => handleModalOpen()} className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" /> Add Trainee
        </button>
        <div>
          <button onClick={exportToExcel} className="btn btn-outline btn-info mr-2">
            <FileSpreadsheet className="w-4 h-4 mr-2" /> Export to Excel
          </button>
          <button onClick={exportToPDF} className="btn btn-outline btn-success mr-2">
            <Download className="w-4 h-4 mr-2" /> Export to PDF
          </button>
          <button
            onClick={() => document.getElementById('fileInput').click()}
            className="btn btn-outline btn-info mr-2 "
          >
            <Upload className="w-4 h-4" />
            Upload Trainees
          </button>
          <input
            id="fileInput"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="input input-bordered w-full max-w-xs mr-2"
          value={filters.searchTerm}
          onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
        />
        <select
          className="select select-bordered w-full max-w-xs mr-2"
          value={filters.filiere}
          onChange={(e) => setFilters({ ...filters, filiere: e.target.value })}
        >
          <option value="">All Filières</option>
          {uniqueFilieres.map((filiere) => (
            <option key={filiere} value={filiere}>{filiere}</option>
          ))}
        </select>
        <select
          className="select select-bordered w-full max-w-xs"
          value={filters.groupe}
          onChange={(e) => setFilters({ ...filters, groupe: e.target.value })}
        >
          <option value="">All Groupes</option>
          {uniqueGroupes.map((groupe) => (
            <option key={groupe} value={groupe}>{groupe}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>CEF</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Année</th>
              <th>Niveau</th>
              <th>Filière</th>
              <th>Groupe</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedTrainees.map((trainee) => (
              <tr key={trainee.id}>
                <td>{trainee.cef}</td>
                <td>{trainee.nom}</td>
                <td>{trainee.prenom}</td>
                <td>{trainee.email}</td>
                <td>{trainee.annee}</td>
                <td>{trainee.niveau}</td>
                <td>{trainee.filiere}</td>
                <td>{trainee.groupe}</td>
                <td>
                  <button onClick={() => handleModalOpen(trainee)} className="btn btn-ghost btn-xs">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(trainee.id)} className="btn btn-ghost btn-xs">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      {modalState.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">{modalState.trainee.id ? 'Edit' : 'Add'} Trainee</h2>
            <form onSubmit={handleSubmit}>
              {Object.keys(INITIAL_STAGIAIRE).map((key) => {
                if (key === "filiere" || key === "groupe") {
                  const options = key === "filiere" ? uniqueFilieres : uniqueGroupes;
                  return (
                    <div key={key} className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">{key}</label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        value={modalState.trainee[key]}
                        onChange={(e) =>
                          setModalState({
                            ...modalState,
                            trainee: { ...modalState.trainee, [key]: e.target.value },
                          })
                        }
                      >
                        <option value="">Sélectionnez {key}</option>
                        {options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }
                return (
                  <div key={key} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">{key}</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={modalState.trainee[key]}
                      onChange={(e) =>
                        setModalState({
                          ...modalState,
                          trainee: { ...modalState.trainee, [key]: e.target.value },
                        })
                      }
                    />
                  </div>
                );
              })}

              <div className="flex justify-end">
                <button type="button" onClick={handleModalClose} className="btn btn-ghost mr-2">Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TraineesPage;