import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDocuments } from '../../features/documents/documentSlice';
import { fetchDemandes, deleteDemande } from '../../features/documents/demandeSlice';
import { getUserFromStorage } from '../../utils';
import {
    CheckCircle,
    FileText,
    Upload,
    AlertCircle,
    Clock,
    Trash,
    Calendar,
    Loader2,
    X,
    Download,
    FilePlus,
    Info,
    ArrowDown
} from 'lucide-react';

const DocumentsPage = () => {
    const dispatch = useDispatch();
    const { documents, loading: documentsLoading, error: documentsError } = useSelector((state) => state.documents);
    const { demandes, loading: demandesLoading, error: demandesError } = useSelector((state) => state.demandes);
    const user = getUserFromStorage('user');

    // Optimize state management
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [requestDate, setRequestDate] = useState('');
    const [files, setFiles] = useState([]);
    const [dateFilter, setDateFilter] = useState('');
    const [alerts, setAlerts] = useState({ success: false, error: null });
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('new-request');

    // Memoized filtered demandes to prevent unnecessary re-renders
    const filteredDemandes = useMemo(() => {
        return demandes
            ? demandes.filter((demande) => demande.user === user?.name)
            : [];
    }, [demandes, user?.name]);

    // Optimize dispatch calls with useCallback
    const initializePage = useCallback(() => {
        dispatch(fetchDocuments());
        dispatch(fetchDemandes());
    }, [dispatch]);

    // Use useEffect with proper dependency management
    useEffect(() => {
        initializePage();
    }, [initializePage]);

    // Memoized file validation
    const validateAndSetFiles = useCallback((selectedFiles) => {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        const validFiles = selectedFiles.filter(
            (file) => validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024
        );

        if (validFiles.length !== selectedFiles.length) {
            setAlerts((prev) => ({
                ...prev,
                error: 'Some files were rejected. Please use only PDF, JPG, or PNG files under 5MB.'
            }));
        }

        setFiles(validFiles);
    }, []);

    // Handlers with useCallback to prevent unnecessary re-renders
    const handleDocumentSelect = useCallback((doc) => {
        setSelectedDocument(doc);
        setFiles([]);
        setRequestDate('');
    }, []);

    const handleFileChange = useCallback((e) => {
        const selectedFiles = Array.from(e.target.files);
        validateAndSetFiles(selectedFiles);
    }, [validateAndSetFiles]);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFiles(Array.from(e.dataTransfer.files));
        }
    }, [validateAndSetFiles]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!selectedDocument) return;

        const newRequest = {
            document: selectedDocument.name,
            description: selectedDocument.description,
            requestDate,
            files: files.map((file) => ({
                name: file.name,
                size: file.size,
                type: file.type
            })),
            user: user?.name || 'Unknown',
            status: 'en cours',
            submissionDate: new Date().toLocaleDateString(),
            processingTime: selectedDocument.processingTime
        };

        try {
            const response = await fetch('http://localhost:3000/demandes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRequest)
            });

            if (!response.ok) throw new Error('Failed to submit request');

            setAlerts({ success: true, error: null });
            setSelectedDocument(null);
            setFiles([]);
            setRequestDate('');
            dispatch(fetchDemandes());
        } catch (error) {
            setAlerts((prev) => ({ ...prev, error: error.message }));
        }
    }, [selectedDocument, requestDate, files, user, dispatch]);

    

    const handleDelete = useCallback((demandeId) => {
        dispatch(deleteDemande(demandeId));
    }, [dispatch]);

    const StatusBadge = ({ status }) => {
        const statusColors = {
            'en cours': 'bg-yellow-100 text-yellow-800',
            'effectuer': 'bg-green-100 text-green-800',
            'rejeter': 'bg-red-100 text-red-800'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="min-h-screen p-8">
            <div className="container mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold flex items-center">
                        <FileText className="mr-3 text-blue-600" size={32} />
                        Document Requests
                    </h1>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setActiveTab('new-request')}
                            className={`px-4 py-2 rounded-lg flex items-center ${activeTab === 'new-request'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700  dark:bg-gray-800 dark:text-white'
                                }`}
                        >
                            <FilePlus className="mr-2" size={20} />
                            New Request
                        </button>
                        <button
                            onClick={() => setActiveTab('my-requests')}
                            className={`px-4 py-2 rounded-lg flex items-center ${activeTab === 'my-requests'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-white'
                                }`}
                        >
                            <Calendar className="mr-2" size={20} />
                            My Requests
                        </button>
                    </div>
                </div>

                {/* Alert Section */}
                {alerts.error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 dark:bg-red-700 " role="alert">
                        <AlertCircle className="inline-block mr-2 align-middle" size={20} />
                        <span className="block sm:inline">{alerts.error}</span>
                    </div>
                )}

                {alerts.success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 dark:bg-green-700 dark:border-green-800 dark:text-green-200" role="alert">
                        <CheckCircle className="inline-block mr-2 align-middle" size={20} />
                        <span className="block sm:inline">Request submitted successfully!</span>
                    </div>
                )}

                {/* Main Content */}
                {activeTab === 'new-request' && (
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Documents List */}
                        <div className="shadow-xl rounded-lg p-6 dark:bg-gray-800">
                            <h2 className="text-xl font-semibold mb-4">Documents Disponible</h2>
                            <hr className='h-px bg-base-200 border-0 my-3' />
                            <div className="space-y-3">
                                {documents.map((doc) => (
                                    <div
                                        key={doc.id}
                                        onClick={() => handleDocumentSelect(doc)}
                                        className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${selectedDocument?.id === doc.id
                                                ? 'bg-blue-100 border-blue-500 border dark:bg-transparent dark:border-blue-300'
                                                : 'bg-gray-100 border-gray-200 hover:bg-blue-50 hover:border-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-blue-800 dark:hover:border-blue-500'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-medium">{doc.name}</h3>
                                                <p className="text-sm text-gray-500">{doc.description}</p>
                                            </div>
                                            <Clock className="text-blue-500" size={20} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Request Form */}
                        <div className="shadow-2xl rounded-lg p-6 dark:bg-gray-800 has-[data-theme=dark]:">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-7">
                                    <label className="block mb-4">Selected Document</label>
                                    {selectedDocument ? (
                                        <div className="bg-blue-50 p-6 rounded-lg flex items-center justify-between dark:bg-blue-950">
                                            <div>
                                                <h3 className="font-medium">{selectedDocument.name}</h3>
                                                <p className="text-sm text-gray-500">{selectedDocument.description}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedDocument(null)}
                                                className="text-red-500 hover:bg-red-100 p-2 rounded-full"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-gray-500 bg-gray-100 p-3 rounded-lg text-center dark:bg-transparent dark:border dark:border-gray-600 dark:text-gray-400">
                                            No document selected
                                        </div>
                                    )}
                                </div>

                                {/* document attachment */}
                                {selectedDocument && (
                                    <div className="mb-7">
                                        <label className="block mb-4">Document Attachment</label>
                                        <div className="space-y-3 mb-3 bg-slate-400 p-6 rounded-lg dark:bg-gray-700">
                                            {selectedDocument.documentAttachment.map((attachment, index) => (
                                                <div key={index} className="">
                                                    <div className="">
                                                        <div>
                                                            <h3 className="font-medium">{attachment}</h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* File Upload Section */}
                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={() => setDragActive(false)}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 ${dragActive ? 'bg-blue-50 border-blue-500 dark:bg-transparent dark:border-blue-300' : 'bg-gray-50 border-gray-300 dark:bg-transparent dark:border-gray-600'
                                        }`}
                                >
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="file-upload"
                                        accept=".pdf,.jpg,.png"
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <Upload className="mx-auto mb-4 text-blue-500" size={40} />
                                        <p className="">
                                            Drag and drop files here or
                                            <span className="text-blue-600 ml-1 font-semibold">Browse</span>
                                        </p>
                                        <p className="text-xs mt-2">
                                            PDF, JPG, and PNG files. Max 5MB each.
                                        </p>
                                    </label>
                                </div>

                                {/* File List */}
                                {files.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium mb-2">Uploaded Files</h4>
                                        <div className="space-y-2">
                                            {files.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-gray-100 p-3 rounded-lg flex items-center justify-between dark:bg-transparent dark:border dark:border-gray-600"
                                                >
                                                    <div className="flex items-center">
                                                        <FileText className="mr-3 text-blue-500" size={20} />
                                                        <div>
                                                            <p className="text-sm">{file.name}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {(file.size / 1024).toFixed(2)} KB
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFiles(files.filter((f) => f !== file))}
                                                        className="text-red-500 hover:bg-red-100 p-2 rounded-full"
                                                    >
                                                        <Trash size={20} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Additional Options */}
                                <div className="mt-7">
                                    <label className="block mb-2">Request Date</label>
                                    <input
                                        type="date"
                                        value={requestDate}
                                        onChange={(e) => setRequestDate(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-transparent dark:border-gray-600 dark:text-gray-400"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={!selectedDocument || files.length === 0}
                                    className="dark:border dark:border-gray-600 dark:bg-transparent dark:text-gray-100 w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin mr-2" size={20} />
                                    ) : (
                                        <Upload className="mr-2" size={20} />
                                    )}
                                    Submit Request
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* My Requests Tab */}
                {activeTab === 'my-requests' && (
                    <div className=" shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <Calendar className="mr-3 text-blue-600" size={24} />
                            My Requests
                        </h2>
                        {filteredDemandes.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                <Info className="mx-auto mb-4 text-blue-500" size={40} />
                                <p>You haven't made any document requests yet.</p>
                            </div>
                        ) : (
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-100 dark:bg-gray-700">
                                        <th className="p-4 text-left">Document</th>
                                        <th className="p-4 text-left">
                                            Submission Date
                                        </th>
                                        <th className="p-4 text-left">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDemandes.map((demande) => (
                                        <tr
                                            key={demande.id}
                                            className="hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <td className="p-4 border-t border-b border-gray-300 dark:border-gray-600">{demande.document}</td>
                                            <td className="p-4 border-t border-b border-gray-300 dark:border-gray-600">{demande.submissionDate}</td>
                                            <td className="p-4 border-t border-b border-gray-300 dark:border-gray-600"><StatusBadge status={demande.status} /></td>
                                            <td className="p-4 border-t border-b border-gray-300 dark:border-gray-600 flex items-center justify-end space-x-2">
                                                {demande.files && (
                                                    <button
                                                        className="text-blue-500 hover:bg-blue-100 p-2 rounded-full"
                                                        title="Download Files"
                                                    >
                                                        <Download size={20} />
                                                    </button>
                                                )}
                                                {demande.status === 'en cours' && (
                                                    <button
                                                        onClick={() => handleDelete(demande.id)}
                                                        className="text-red-500 hover:bg-red-100 p-2 rounded-full"
                                                        title="Cancel Request"
                                                    >
                                                        <Trash size={20} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
);
};

export default DocumentsPage;
