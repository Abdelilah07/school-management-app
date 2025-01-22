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
    X
} from 'lucide-react';

const DemandesPage = () => {
    const dispatch = useDispatch();
    const { demandes, loading } = useSelector((state) => state.demandes);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        document: '',
        status: '',
        date: ''
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
        'effectuer': 'badge-success',
        'rejeter': 'badge-error'
    };

    const stats = [
        {
            title: 'Total Demandes',
            value: demandes.length,
            icon: <FileText className="w-8 h-8" />,
            color: 'bg-primary/10 text-primary'
        },
        {
            title: 'En Cours',
            value: demandes.filter(d => d.status === 'en cours').length,
            icon: <Clock className="w-8 h-8" />,
            color: 'bg-warning/10 text-warning'
        },
        {
            title: 'Effectuées',
            value: demandes.filter(d => d.status === 'effectuer').length,
            icon: <CheckCircle className="w-8 h-8" />,
            color: 'bg-success/10 text-success'
        },
        {
            title: 'Rejetées',
            value: demandes.filter(d => d.status === 'rejeter').length,
            icon: <AlertCircle className="w-8 h-8" />,
            color: 'bg-error/10 text-error'
        }
    ];

    const filteredDemandes = demandes.filter(demande => {
        const matchesSearch = demande.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            demande.document.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDocument = !filters.document || demande.document === filters.document;
        const matchesStatus = !filters.status || demande.status === filters.status;
        return matchesSearch && matchesDocument && matchesStatus;
    });

    const handleEdit = (demande) => {
        setSelectedDemande(demande);
        setIsEditModalOpen(true);
    };

    const handleDelete = (demande) => {
        dispatch(deleteDemande(demande.id));
        const newDemandes = demandes.filter((d) => d.id !== demande.id);
        dispatch(fetchDemandes(newDemandes));
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <div key={index} className={`card ${stat.color}`}>
                        <div className="flex flex-row items-center justify-between card-body">
                            <div>
                                <h2 className="text-lg card-title">{stat.title}</h2>
                                <p className="text-3xl font-bold">{stat.value}</p>
                            </div>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters and Search */}
            <div className="p-4 rounded-lg bg-base-200">
                <div className="grid items-center grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-12">
                    {/* Search Input - Takes 4 columns on large screens */}
                    <div className="lg:col-span-4">
                        <div className="w-full join">
                            <div className="flex items-center px-3 join-item bg-base-100">
                                <Search className="w-5 h-5 text-base-content/70" />
                            </div>
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                className="w-full input input-bordered join-item"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Document Filter - Takes 3 columns on large screens */}
                    <div className="lg:col-span-3">
                        <select
                            className="w-full select select-bordered"
                            value={filters.document}
                            onChange={(e) => setFilters({ ...filters, document: e.target.value })}
                        >
                            <option value="">Tous les documents</option>
                            {Array.from(new Set(demandes.map(d => d.document))).map(doc => (
                                <option key={doc} value={doc}>{doc}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter - Takes 3 columns on large screens */}
                    <div className="lg:col-span-3">
                        <select
                            className="w-full select select-bordered"
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
                            className="w-full btn btn-ghost"
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

            {/* Demandes Table for Large Screens */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Document</th>
                            <th>Stagiaire</th>
                            <th>CEF</th>
                            <th>Groupe</th>
                            <th>Date</th>
                            <th>Statut</th>
                            <th>Files Attached</th>
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
                                            <Building className="w-4 h-4" />
                                            {demande.cef}
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
                                    <td className="flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        <div className="flex flex-col items-center gap-2">
                                            {demande.files.map((file, index) => (
                                                <div key={index} className="badge badge-secondary">{file.name}</div>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleView(demande)}
                                                className="btn btn-ghost btn-sm"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(demande)}
                                                className="btn btn-ghost btn-sm"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(demande)}
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

            {/* Demandes Cards for Medium and Small Screens */}
            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDemandes
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((demande) => (
                        <div key={demande.id} className="card bg-base-100 shadow-md">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        <span className="font-medium">{demande.document}</span>
                                    </div>
                                    <div className={`badge ${statusColors[demande.status]} gap-1`}>
                                        {demande.status === 'en cours' && <Clock className="w-3 h-3" />}
                                        {demande.status === 'effectuer' && <CheckCircle className="w-3 h-3" />}
                                        {demande.status === 'rejeter' && <AlertTriangle className="w-3 h-3" />}
                                        {demande.status}
                                    </div>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span>{demande.user}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Building className="w-4 h-4" />
                                        <span>{demande.cef}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        <span>{demande.group}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{demande.requestDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        <div className="flex flex-wrap gap-2">
                                            {demande.files.map((file, index) => (
                                                <div key={index} className="badge badge-secondary">{file.name}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => handleView(demande)}
                                        className="btn btn-ghost btn-sm"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleEdit(demande)}
                                        className="btn btn-ghost btn-sm"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => dispatch(deleteDemande(demande.id))}
                                        className="btn btn-ghost btn-sm text-error"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center">
                <div className="join">
                    {Array.from({ length: Math.ceil(filteredDemandes.length / itemsPerPage) }).map((_, index) => (
                        <button
                            key={index}
                            className={`join-item btn ${currentPage === index + 1 ? 'btn-active' : ''}`}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* View Modal */}
            {isViewModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="mb-4 text-lg font-bold">Détails de la demande</h3>
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
                                    <p className="font-medium">{selectedDemande.cef}</p>
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
                        <h3 className="mb-4 text-lg font-bold">Modifier le statut</h3>
                        <div className="space-y-4">
                            <button
                                className="justify-start gap-2 btn btn-warning btn-block"
                                onClick={() => handleStatusUpdate('en cours')}
                            >
                                <Clock className="w-5 h-5" />
                                En Cours
                            </button>
                            <button
                                className="justify-start gap-2 btn btn-success btn-block"
                                onClick={() => handleStatusUpdate('effectuer')}
                            >
                                <CheckCircle className="w-5 h-5" />
                                Effectuer
                            </button>
                            <button
                                className="justify-start gap-2 btn btn-error btn-block"
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