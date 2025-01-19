import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDocuments } from '../../features/documents/documentSlice';
import { fetchDemandes, deleteDemande } from '../../features/documents/demandeSlice';
import { getUserFromStorage } from '../../utils';
import {
    FileText, Upload, Trash, Calendar, Loader2, X, Download,
    FilePlus, Info, Check, AlertTriangle, Clock, User,
    Users, Building, FolderOpen, FileQuestion, Shield,
    ArrowUpCircle, BadgeCheck, FileWarning
} from 'lucide-react';

const DocumentsPage = () => {
    const dispatch = useDispatch();
    const { documents, loading: documentsLoading } = useSelector((state) => state.documents);
    const { demandes, loading: demandesLoading } = useSelector((state) => state.demandes);
    const user = getUserFromStorage('user');

    const [selectedDocument, setSelectedDocument] = useState(null);
    const [requestDate, setRequestDate] = useState('');
    const [files, setFiles] = useState([]);
    const [alerts, setAlerts] = useState({ success: false, error: null });
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('new-request');

    useEffect(() => {
        dispatch(fetchDocuments());
        dispatch(fetchDemandes());
    }, [dispatch]);

    const validateAndSetFiles = useCallback((selectedFiles) => {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        const validFiles = Array.from(selectedFiles).filter(
            (file) => validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024
        );

        if (validFiles.length !== selectedFiles.length) {
            setAlerts({
                success: false,
                error: 'Only PDF, JPG, or PNG files under 5MB are allowed.'
            });
        }

        setFiles(validFiles);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDocument || !requestDate || files.length === 0) return;

        setLoading(true);

        const newRequest = {
            document: selectedDocument.name,
            description: selectedDocument.description,
            requestDate,
            files: files.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type,
            })),
            user: user?.name || 'Unknown',
            CEF: user?.id || 'Unknown',
            group: user?.group || 'DEV101',
            status: 'en cours',
            submissionDate: new Date().toLocaleDateString(),
            processingTime: selectedDocument.processingTime,
        };

        try {
            const response = await fetch('http://localhost:3000/demandes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRequest),
            });

            if (!response.ok) throw new Error('Failed to submit request');

            setAlerts({ success: true, error: null });
            setSelectedDocument(null);
            setFiles([]);
            setRequestDate('');
            dispatch(fetchDemandes());
        } catch (error) {
            setAlerts({ success: false, error: error.message });
        } finally {
            setLoading(false);
        }
    };

    const StatusBadge = ({ status }) => {
        const statusConfig = {
            'en cours': {
                class: 'badge-warning',
                icon: <Clock className="w-4 h-4 mr-1" />
            },
            'effectuer': {
                class: 'badge-success',
                icon: <Check className="w-4 h-4 mr-1" />
            },
            'rejeter': {
                class: 'badge-error',
                icon: <AlertTriangle className="w-4 h-4 mr-1" />
            }
        };

        const config = statusConfig[status] || {
            class: 'badge-ghost',
            icon: <FileQuestion className="w-4 h-4 mr-1" />
        };

        return (
            <div className={`badge ${config.class} gap-1`}>
                {config.icon}
                {status}
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4">
            {/* Alerts */}
            {alerts.success && (
                <div className="alert alert-success mb-4">
                    <BadgeCheck className="w-6 h-6" />
                    <span>Request submitted successfully!</span>
                </div>
            )}

            {alerts.error && (
                <div className="alert alert-error mb-4">
                    <FileWarning className="w-6 h-6" />
                    <span>{alerts.error}</span>
                </div>
            )}

            {/* Tabs */}
            <div className="tabs tabs-boxed mb-6">
                <button
                    className={`tab tab-lg gap-2 ${activeTab === 'new-request' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('new-request')}
                >
                    <FilePlus className="w-5 h-5" />
                    New Request
                </button>
                <button
                    className={`tab tab-lg gap-2 ${activeTab === 'my-requests' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('my-requests')}
                >
                    <FolderOpen className="w-5 h-5" />
                    My Requests
                </button>
            </div>

            {activeTab === 'new-request' ? (
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Available Documents */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title flex gap-2">
                                <Shield className="w-6 h-6 text-primary" />
                                Available Documents
                            </h2>
                            <div className="divider"></div>
                            <div className="space-y-4">
                                {documents.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className={`card bg-base-200 cursor-pointer transition-all hover:bg-base-300 ${selectedDocument?.id === doc.id ? 'ring-2 ring-primary' : ''
                                            }`}
                                        onClick={() => setSelectedDocument(doc)}
                                    >
                                        <div className="card-body p-4">
                                            <h3 className="font-medium flex items-center gap-2">
                                                <FileText className="w-5 h-5 text-primary" />
                                                {doc.name}
                                            </h3>
                                            <p className="text-sm opacity-70">{doc.description}</p>
                                            <div className="flex items-center gap-2 mt-2 text-sm opacity-70">
                                                <Clock className="w-4 h-4" />
                                                Processing time: {doc.processingTime}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Request Form */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title flex gap-2">
                                <ArrowUpCircle className="w-6 h-6 text-primary" />
                                Submit Request
                            </h2>
                            <div className="divider"></div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Selected Document Display */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Selected Document</span>
                                    </label>
                                    {selectedDocument ? (
                                        <div className="bg-base-200 p-4 flex items-center justify-between">
                                            <div>
                                                <h3 className="font-bold">{selectedDocument.name}</h3>
                                                <p className="text-sm">{selectedDocument.description}</p>
                                            </div>
                                            <button
                                                type="button"
                                                className="btn btn-ghost btn-circle"
                                                onClick={() => setSelectedDocument(null)}
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="alert alert-warning">
                                            <FileQuestion className="w-5 h-5" />
                                            <span>Please select a document from the list</span>
                                        </div>
                                    )}
                                </div>

                                {/* Required Documents */}
                                {selectedDocument && (
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Required Documents</span>
                                        </label>
                                        <div className="bg-neutral-100 p-4">
                                            <ul className="list-disc list-inside">
                                                {selectedDocument.documentAttachment.map((doc, index) => (
                                                    <li key={index} className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4" />
                                                        {doc}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {/* File Upload */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Upload Files</span>
                                    </label>
                                    <div
                                        className={`border-2 border-dashed rounded-box p-8 text-center transition-colors ${dragActive ? 'border-primary bg-primary/10' : 'border-base-300'
                                            }`}
                                        onDragEnter={(e) => {
                                            e.preventDefault();
                                            setDragActive(true);
                                        }}
                                        onDragLeave={() => setDragActive(false)}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setDragActive(false);
                                            validateAndSetFiles(e.dataTransfer.files);
                                        }}
                                    >
                                        <input
                                            type="file"
                                            multiple
                                            id="file-upload"
                                            className="hidden"
                                            onChange={(e) => validateAndSetFiles(e.target.files)}
                                            accept=".pdf,.jpg,.png"
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
                                            <p className="text-lg mb-2">
                                                Drag and drop files here or <span className="text-primary">browse</span>
                                            </p>
                                            <p className="text-sm opacity-70">PDF, JPG, and PNG files (max 5MB each)</p>
                                        </label>
                                    </div>

                                    {/* File List */}
                                    {files.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {files.map((file, index) => (
                                                <div key={index} className="bg-base-200 p-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-5 h-5" />
                                                        <div>
                                                            <p className="font-medium">{file.name}</p>
                                                            <p className="text-sm opacity-70">
                                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-ghost btn-circle"
                                                        onClick={() => setFiles(files.filter((_, i) => i !== index))}
                                                    >
                                                        <Trash className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Request Date */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Request Date</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="input input-bordered"
                                        value={requestDate}
                                        onChange={(e) => setRequestDate(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                                    disabled={!selectedDocument || files.length === 0 || !requestDate || loading}
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <ArrowUpCircle className="w-5 h-5" />
                                    )}
                                    Submit Request
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                /* My Requests Tab */
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title flex gap-2">
                            <FolderOpen className="w-6 h-6 text-primary" />
                            My Requests
                        </h2>
                        <div className="divider"></div>

                        {demandes.filter(d => d.user === user?.name).length === 0 ? (
                            <div className="text-center py-12">
                                <Info className="w-16 h-16 mx-auto mb-4 text-primary" />
                                <h3 className="text-lg font-medium">No Requests Found</h3>
                                <p className="text-sm opacity-70">You haven't made any document requests yet.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            <th>Document</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Processing Time</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {demandes
                                            .filter(d => d.user === user?.name)
                                            .map((demande) => (
                                                <tr key={demande.id}>
                                                    <td>
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="w-5 h-5 text-primary" />
                                                            {demande.document}
                                                        </div>
                                                    </td>
                                                    <td>{demande.submissionDate}</td>
                                                    <td>
                                                        <StatusBadge status={demande.status} />
                                                    </td>
                                                    <td>{demande.processingTime}</td>
                                                    <td>
                                                        <div className="flex gap-2">
                                                            <button className="btn btn-ghost btn-circle">
                                                                <Download className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                className="btn btn-ghost btn-circle"
                                                                onClick={() => dispatch(deleteDemande(demande.id))}
                                                            >
                                                                <Trash className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DocumentsPage;