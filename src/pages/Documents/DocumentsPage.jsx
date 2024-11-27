import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDocuments } from '../../features/documents/documentSlice';
import { fetchDemandes, deleteDemande } from '../../features/documents/demandeSlice';
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
} from 'lucide-react';
import axios from 'axios';

const DocumentsPage = () => {
  const dispatch = useDispatch();
  const { documents, loading, error } = useSelector((state) => state.documents);
  const { demandes } = useSelector((state) => state.demandes);

  const [selectedDocument, setSelectedDocument] = useState(null);
  const [requestDate, setRequestDate] = useState('');
  const [files, setFiles] = useState([]);
  const [userData, setUserData] = useState(null);
  const [alerts, setAlerts] = useState({ success: false, error: null });
  const [dragActive, setDragActive] = useState(false);
  const [filteredDemandes, setFilteredDemandes] = useState([]);

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchDemandes());
  }, [dispatch]);

  useEffect(() => {
    if (alerts.success) {
      const timer = setTimeout(() => {
        setAlerts((prev) => ({ ...prev, success: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alerts.success]);

  const handleDocumentSelect = (doc) => {
    setSelectedDocument(doc);
    setFiles([]);
    setRequestDate('');
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    validateAndSetFiles(selectedFiles);
  };

  const validateAndSetFiles = (selectedFiles) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const validFiles = selectedFiles.filter(
      (file) => validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== selectedFiles.length) {
      setAlerts((prev) => ({
        ...prev,
        error:
          'Certains fichiers ont été rejetés. Veuillez utiliser uniquement des fichiers PDF, JPG ou PNG de moins de 5 Mo.',
      }));
    }

    setFiles(validFiles);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFiles(Array.from(e.dataTransfer.files));
    }
  };

  const userId =
    (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).id) ||
    (sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user')).id) ||
    null;

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const response = await axios.get('http://localhost:3000/users');
          const user = response.data.find((u) => u.id === userId);
          setUserData(user);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUser();
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newRequest = {
      document: selectedDocument.name,
      description: selectedDocument.description,
      requestDate,
      files: files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
      user: userData?.name || 'Inconnu',
      status: 'en cours',
      submissionDate: new Date().toLocaleDateString(),
      processingTime: selectedDocument.processingTime,
    };

    try {
      const response = await fetch('http://localhost:3000/demandes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRequest),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      setAlerts({ success: true, error: null });
      setSelectedDocument(null);
      setFiles([]);
      setRequestDate('');
    } catch (error) {
      setAlerts((prev) => ({ ...prev, error: error.message }));
    }
  };

  useEffect(() => {
    if (userData && demandes) {
      const filtered = demandes.filter((demande) => demande.user === userData?.name);
      setFilteredDemandes(filtered);
    }
  }, [userData, demandes]);

  const handleDelete = (demandeId) => {
    dispatch(deleteDemande(demandeId));
    const newDemandes = documents.filter((d) => d.id !== demandeId);
    dispatch(fetchDocuments(newDemandes));
  };

  const isFormValid = selectedDocument && requestDate && files.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div>Error fetching demandes: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Demande de Documents</h1>
        <p className="text-gray-600 text-lg">Portail de demande de documents administratifs</p>
      </div>

      <hr className="h-px bg-gray-200 border-0 my-4" />

      {alerts.success && (
        <div className="alert alert-success mb-6">
          <CheckCircle className="w-5 h-5" />
          <span>
            Votre demande a été soumise avec succès. Vous pouvez suivre son état ci-dessous.
          </span>
        </div>
      )}

      {alerts.error && (
        <div className="alert alert-error mb-6">
          <AlertCircle className="w-5 h-5" />
          <span>{alerts.error}</span>
          <button
            onClick={() => setAlerts((prev) => ({ ...prev, error: null }))}
            className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-5 gap-6">
        {/* Document Selection */}
        <div className="md:col-span-2">
          <div className="card bg-base-100 shadow-xl border border-gray-400 rounded">
            <div className="card-body">
              <h2 className="card-title flex items-center gap-2 my-3">
                <FileText className="w-5 h-5" />
                Documents Disponibles
              </h2>
              <div className="space-y-3">
                {(documents || []).map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => handleDocumentSelect(doc)}
                    className={`w-full text-left transition-all ${
                      selectedDocument?.id === doc.id
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-base-200 border-base-300'
                    } border border-gray-400 rounded-lg p-3 focus:outline-none`}
                  >
                    <div className="flex items-start gap-3">
                      <FileText
                        className={`w-5 h-5 mt-1 ${
                          selectedDocument?.id === doc.id ? 'text-primary' : 'text-base-content/60'
                        }`}
                      />
                      <div>
                        <h3 className="font-medium">{doc.name}</h3>
                        <p className="text-sm text-base-content/60 mt-1">{doc.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-base-content/60">
                          <Clock className="w-4 h-4" />
                          {doc.processingTime}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Request Form */}
        <div className="md:col-span-3">
          <div className="card bg-base-100 shadow-xl border border-gray-400 rounded">
            <div className="card-body">
              {selectedDocument ? (
                selectedDocument.documentLink ? (
                  <a
                    href={selectedDocument.documentLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-block"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Telecharger
                  </a>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        {selectedDocument.name}
                      </h2>
                      <p className="text-base-content/60 mt-1">{selectedDocument.description}</p>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Date de demande</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={requestDate}
                          onChange={(e) => setRequestDate(e.target.value)}
                          className="input input-bordered w-full pr-10"
                          min={new Date().toISOString().split('T')[0]}
                        />
                        <Calendar className="absolute right-3 top-3 w-5 h-5 text-base-content/40" />
                      </div>
                    </div>

                    <div className="alert alert-info">
                      <AlertCircle className="w-5 h-5" />
                      <div>
                        <h3 className="font-medium">Documents requis :</h3>
                        <ul className="mt-2 space-y-1 ml-6 list-disc">
                          {selectedDocument.documentAttachment.map((doc, index) => (
                            <li key={index}>{doc}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div
                      className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                        dragActive ? 'border-primary bg-primary/5' : 'border-base-300'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <div className="text-center">
                        <Upload className="mx-auto w-8 h-8 text-base-content/40" />
                        <p className="mt-2 text-sm">
                          Glissez-déposez vos fichiers ici ou
                          <label className="link link-primary mx-1 cursor-pointer">
                            parcourez
                            <input
                              type="file"
                              multiple
                              onChange={handleFileChange}
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                            />
                          </label>
                        </p>
                        <p className="text-xs text-base-content/60 mt-1">
                          PDF, JPG ou PNG (max. 5 Mo)
                        </p>
                      </div>
                    </div>

                    {files.length > 0 && (
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-base-200 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-5 h-5" />
                              <span className="text-sm">{file.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFiles(files.filter((_, i) => i !== index))}
                              className="btn btn-ghost btn-circle btn-sm"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!isFormValid}
                      className="btn btn-primary w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Soumettre la demande
                    </button>
                  </form>
                )
              ) : (
                <div className="alert alert-info">
                  <AlertCircle className="w-5 h-5" />
                  <span>Veuillez choisir un document pour soumettre une demande.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      {/* Demands Section */}
      <div>
        <h1 className="text-2xl font-bold mb-4 text-center">Vos Demandes</h1>
        {filteredDemandes.length === 0 ? (
          <p>Aucune demande trouvée.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredDemandes.map((demande) => (
              <div key={demande.id} className="relative">
                <span
                  className={`absolute z-10 px-2 py-1 -left-2 -top-2 rounded-lg -rotate-[10deg] border ${
                    demande.status === 'en cours'
                      ? 'border-yellow-500 text-yellow-500 bg-white dark:bg-gray-800'
                      : demande.status === 'effectuer'
                        ? 'border-green-500 text-green-500 bg-white dark:bg-gray-800'
                        : 'border-red-500 text-red-500 bg-white dark:bg-gray-800'
                  }`}
                >
                  {demande.status}
                </span>

                <div className="p-6 border border-gray-400 rounded-xl bg-white dark:bg-gray-800 h-full">
                  <div className="space-y-4">
                    <div>
                      <h2 className="font-semibold">{demande.document}</h2>
                      <p className="text-sm text-gray-500 mt-3">Date: {demande.requestDate}</p>
                    </div>

                    <div className="flex justify-end items-center space-x-2">
                      {demande.status !== 'effectuer' && demande.status !== 'rejeter' && (
                        <button
                          onClick={() => handleDelete(demande.id)}
                          className="p-1 hover:text-red-500 transition-colors"
                          title="Supprimer la demande"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;