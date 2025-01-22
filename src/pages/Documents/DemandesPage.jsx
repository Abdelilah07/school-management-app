import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDemandes, editDemande, deleteDemande } from '../../features/documents/demandeSlice';
import {
  Edit,
  Trash,
  Eye,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  Filter,
  RefreshCcw,
  Search,
  Calendar,
  User,
  Users,
  Building,
  AlertTriangle,
  X,
} from 'lucide-react';

const DemandesPage = () => {
  const dispatch = useDispatch();
  const { demandes, loading } = useSelector((state) => state.demandes);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    document: '',
    status: '',
    date: '',
  });
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchDemandes());
  }, [dispatch]);

  const itemsPerPage = 6;
  const statusColors = {
    'en cours': 'badge-warning',
    effectuer: 'badge-success',
    rejeter: 'badge-error',
  };

  const stats = [
    {
      title: 'Total Demandes',
      value: demandes.length,
      icon: <FileText className="w-8 h-8" />,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'En Cours',
      value: demandes.filter((d) => d.status === 'en cours').length,
      icon: <Clock className="w-8 h-8" />,
      color: 'bg-warning/10 text-warning',
    },
    {
      title: 'Effectuées',
      value: demandes.filter((d) => d.status === 'effectuer').length,
      icon: <CheckCircle className="w-8 h-8" />,
      color: 'bg-success/10 text-success',
    },
    {
      title: 'Rejetées',
      value: demandes.filter((d) => d.status === 'rejeter').length,
      icon: <AlertCircle className="w-8 h-8" />,
      color: 'bg-error/10 text-error',
    },
  ];

  const filteredDemandes = demandes.filter((demande) => {
    const matchesSearch =
      demande.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demande.document.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDocument = !filters.document || demande.document === filters.document;
    const matchesStatus = !filters.status || demande.status === filters.status;
    return matchesSearch && matchesDocument && matchesStatus;
  });

  const handleEdit = (demande) => {
    setSelectedDemande(demande);
    setIsEditModalOpen(true);
  };

  const handleView = (demande) => {
    setSelectedDemande(demande);
    setIsViewModalOpen(true);
  };

  const handleStatusUpdate = (newStatus) => {
    dispatch(editDemande({ id: selectedDemande.id, status: newStatus }));
    setIsEditModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`card ${stat.color}`}>
            <div className="card-body flex flex-row items-center justify-between">
              <div>
                <h2 className="card-title text-lg">{stat.title}</h2>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-base-200 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Input - Takes 4 columns on large screens */}
          <div className="lg:col-span-4">
            <div className="join w-full">
              <div className="join-item bg-base-100 px-3 flex items-center">
                <Search className="w-5 h-5 text-base-content/70" />
              </div>
              <input
                type="text"
                placeholder="Rechercher..."
                className="input input-bordered join-item w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Document Filter - Takes 3 columns on large screens */}
          <div className="lg:col-span-3">
            <select
              className="select select-bordered w-full"
              value={filters.document}
              onChange={(e) => setFilters({ ...filters, document: e.target.value })}
            >
              <option value="">Tous les documents</option>
              {Array.from(new Set(demandes.map((d) => d.document))).map((doc) => (
                <option key={doc} value={doc}>
                  {doc}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter - Takes 3 columns on large screens */}
          <div className="lg:col-span-3">
            <select
              className="select select-bordered w-full"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">Tous les statuts</option>
              <option value="en cours">En Cours</option>
              <option value="effectuer">Effectuer</option>
              <option value="rejeter">Rejeter</option>
            </select>
          </div>

          {/* Reset Button - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <button
              className="btn btn-ghost w-full"
              onClick={() => {
                setSearchTerm('');
                setFilters({ document: '', status: '', date: '' });
              }}
            >
              <RefreshCcw className="w-5 h-5" />
              <span className="hidden sm:inline">Réinitialiser</span>
            </button>
          </div>
        </div>
      </div>

      {/* Demandes Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Document</th>
              <th>Stagiaire</th>
              <th>Groupe</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDemandes
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((demande) => (
                <tr key={demande.id}>
                  <td className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {demande.document}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {demande.user}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {demande.group}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {demande.requestDate}
                    </div>
                  </td>
                  <td>
                    <div className={`badge ${statusColors[demande.status]} gap-1`}>
                      {demande.status === 'en cours' && <Clock className="w-3 h-3" />}
                      {demande.status === 'effectuer' && <CheckCircle className="w-3 h-3" />}
                      {demande.status === 'rejeter' && <AlertTriangle className="w-3 h-3" />}
                      {demande.status}
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => handleView(demande)} className="btn btn-ghost btn-sm">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleEdit(demande)} className="btn btn-ghost btn-sm">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => dispatch(deleteDemande(demande.id))}
                        className="btn btn-ghost btn-sm text-error"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <div className="join">
          {Array.from({ length: Math.ceil(filteredDemandes.length / itemsPerPage) }).map(
            (_, index) => (
              <button
                key={index}
                className={`join-item btn ${currentPage === index + 1 ? 'btn-active' : ''}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      </div>

      {/* View Modal */}
      {isViewModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Détails de la demande</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                <div>
                  <p className="text-sm opacity-70">Document</p>
                  <p className="font-medium">{selectedDemande.document}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5" />
                <div>
                  <p className="text-sm opacity-70">Stagiaire</p>
                  <p className="font-medium">{selectedDemande.user}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5" />
                <div>
                  <p className="text-sm opacity-70">CEF</p>
                  <p className="font-medium">{selectedDemande.CEF}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                <div>
                  <p className="text-sm opacity-70">Groupe</p>
                  <p className="font-medium">{selectedDemande.group}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5" />
                <div>
                  <p className="text-sm opacity-70">Date</p>
                  <p className="font-medium">{selectedDemande.requestDate}</p>
                </div>
              </div>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setIsViewModalOpen(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Modifier le statut</h3>
            <div className="space-y-4">
              <button
                className="btn btn-warning btn-block justify-start gap-2"
                onClick={() => handleStatusUpdate('en cours')}
              >
                <Clock className="w-5 h-5" />
                En Cours
              </button>
              <button
                className="btn btn-success btn-block justify-start gap-2"
                onClick={() => handleStatusUpdate('effectuer')}
              >
                <CheckCircle className="w-5 h-5" />
                Effectuer
              </button>
              <button
                className="btn btn-error btn-block justify-start gap-2"
                onClick={() => handleStatusUpdate('rejeter')}
              >
                <AlertTriangle className="w-5 h-5" />
                Rejeter
              </button>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setIsEditModalOpen(false)}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemandesPage;
