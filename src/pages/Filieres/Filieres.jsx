import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFilieres, deleteFiliere, editFiliere } from '../../features/filieres/filieresSlice';
import AddFiliere from './components/AddFiliere';
import ViewFiliere from './components/ViewFiliere';
import { Link } from 'react-router-dom';
import { Edit, Eye, Trash2, Download, Plus, X, AlertCircle, Users } from 'lucide-react';

const Filieres = () => {
  const dispatch = useDispatch();
  const { filieres, loading, error } = useSelector((state) => state.filieres);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [selectedFiliere, setSelectedFiliere] = useState(null);

  useEffect(() => {
    dispatch(fetchFilieres());
  }, [dispatch]);

  const openModal = (filiere, mode) => {
    setSelectedFiliere(filiere);
    setViewMode(mode === 'view');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFiliere(null);
    setViewMode(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this filiere?')) {
      await dispatch(deleteFiliere(id));
      closeModal();
    }
  };

  const handleSaveEdit = async (updatedFiliere) => {
    await dispatch(editFiliere(updatedFiliere));
    closeModal();
  };

  const exportFilieres = () => {
    const headers = ['ID', 'Code Filiere', 'Intitule Filiere', 'Secteur'];
    const rows = filieres.map((filiere) => [
      filiere.code_filiere,
      filiere.intitule_filiere,
      filiere.secteur,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
    link.download = 'filieres.csv';
    link.click();
  };

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
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={exportFilieres} className="btn btn-primary gap-2">
          <Download className="w-5 h-5" />
          Export Filieres (CSV)
        </button>
        <button onClick={() => openModal(null, 'edit')} className="btn btn-accent gap-2">
          <Plus className="w-5 h-5" />
          Ajouter une Filière
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <form method="dialog">
              <button
                onClick={closeModal}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
            {viewMode ? (
              <ViewFiliere filiere={selectedFiliere} closeModal={closeModal} />
            ) : (
              <AddFiliere
                closeModal={closeModal}
                selectedFiliere={selectedFiliere}
                onSave={handleSaveEdit}
              />
            )}
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={closeModal}>close</button>
          </form>
        </dialog>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Intitule Filiere</th>
              <th>Secteur</th>
              <th>Groupes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filieres.map((filiere) => (
              <tr key={filiere.id}>
                <td>{filiere.code_filiere}</td>
                <td>{filiere.intitule_filiere}</td>
                <td>{filiere.secteur}</td>
                <td>
                  <Link
                    to={`/filieres/groupes/${filiere.code_filiere}`}
                    className="link link-primary flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    groupes
                  </Link>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(filiere, 'view')}
                      className="btn btn-info btn-sm"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openModal(filiere, 'edit')}
                      className="btn btn-success btn-sm"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(filiere.id)}
                      className="btn btn-error btn-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Filieres;
