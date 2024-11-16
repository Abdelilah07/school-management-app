import { useState } from 'react';
import { AlertCircle, FileText, Upload, Clock, CheckCircle, XCircle } from 'lucide-react';

const DocumentsPage = () => {
  const documentList = [
    {
      id: 1,
      name: 'Attestation de présence',
      description: 'Document confirmant votre présence aux cours',
      documentattachment: ["Carte d'identité", 'Lettre de demande de document'],
      processingTime: '2-3 jours',
    },
    {
      id: 2,
      name: 'Attestation de fin de formation',
      description: 'Certificat officiel de fin de formation',
      documentattachment: [
        "Carte d'identité",
        'Lettre de demande de document',
        'Certificat de stage',
      ],
      processingTime: '3-5 jours',
    },
    {
      id: 3,
      name: 'Relevé de notes',
      description: 'Document détaillant vos résultats académiques',
      documentattachment: [
        "Carte d'identité",
        'Lettre de demande de document',
        'Attestation de présence',
      ],
      processingTime: '2-3 jours',
    },
    {
      id: 4,
      name: 'Certificat de stage',
      description: 'Attestation officielle de stage',
      documentattachment: ["Carte d'identité", 'Lettre de demande de stage en entreprise'],
      processingTime: '3-4 jours',
    },
    {
      id: 5,
      name: 'Demande de stage',
      description: 'Formulaire de demande de stage',
      documentattachment: ['Lettre de motivation', 'CV'],
      processingTime: '5-7 jours',
    },
  ];

  const statusList = [
    { id: 1, name: 'En cours', color: 'warning', icon: Clock },
    { id: 2, name: 'En attente', color: 'info', icon: Clock },
    { id: 3, name: 'Validé', color: 'success', icon: CheckCircle },
    { id: 4, name: 'Refusé', color: 'error', icon: XCircle },
  ];

  const [selectedDocument, setSelectedDocument] = useState(null);
  const [requestDate, setRequestDate] = useState('');
  const [files, setFiles] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleDocumentSelect = (doc) => {
    setSelectedDocument(doc);
    setFiles([]); // Reset files when changing document
  };

  const handleFileChange = (event) => {
    const fileList = Array.from(event.target.files);
    setFiles(fileList);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newRequest = {
      id: requests.length + 1,
      document: selectedDocument.name,
      description: selectedDocument.description,
      requestDate,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 1, // En cours
      files: files.map((f) => f.name),
      processingTime: selectedDocument.processingTime,
    };

    setRequests([newRequest, ...requests]);
    setShowSuccessAlert(true);

    // Reset form
    setSelectedDocument(null);
    setRequestDate('');
    setFiles([]);

    setTimeout(() => setShowSuccessAlert(false), 5000);
  };

  const isFormValid =
    selectedDocument && requestDate && files.length >= selectedDocument?.documentattachment.length;

  const renderStatusBadge = (statusId) => {
    const status = statusList.find((s) => s.id === statusId);
    const StatusIcon = status.icon;

    return (
      <div className={`badge badge-${status.color} gap-2`}>
        <StatusIcon className="w-4 h-4" />
        {status.name}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Demande de Documents</h1>
        <p className="text-gray-600">Portail de demande de documents administratifs</p>
      </div>

      {showSuccessAlert && (
        <div className="alert alert-success mb-6">
          <CheckCircle className="w-5 h-5" />
          <span>
            Votre demande a été soumise avec succès. Vous pouvez suivre son état ci-dessous.
          </span>
        </div>
      )}

      <div className="grid md:grid-cols-5 gap-6">
        {/* Left side - Document Selection */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Documents Disponibles</h2>
          <div className="space-y-2">
            {documentList.map((doc) => (
              <button
                key={doc.id}
                onClick={() => handleDocumentSelect(doc)}
                className={`w-full p-4 rounded-lg border transition-all ${
                  selectedDocument?.id === doc.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText
                    className={`w-5 h-5 ${
                      selectedDocument?.id === doc.id ? 'text-primary' : 'text-gray-500'
                    }`}
                  />
                  <div className="text-left">
                    <h3 className="font-medium">{doc.name}</h3>
                    <p className="text-sm text-gray-600">{doc.processingTime}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right side - Form */}
        <div className="md:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                {selectedDocument ? (
                  <>
                    <h2 className="card-title flex gap-2">
                      <FileText className="w-5 h-5" />
                      {selectedDocument.name}
                    </h2>
                    <p className="text-gray-600">{selectedDocument.description}</p>

                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Date souhaitée de réception</span>
                      </label>
                      <input
                        type="date"
                        value={requestDate}
                        onChange={(e) => setRequestDate(e.target.value)}
                        className="input input-bordered w-full"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="alert alert-info mt-4">
                      <AlertCircle className="w-5 h-5" />
                      <span>Documents requis :</span>
                    </div>

                    <ul className="list-disc list-inside space-y-1 ml-4">
                      {selectedDocument.documentattachment.map((doc, index) => (
                        <li key={index} className="text-gray-600">
                          {doc}
                        </li>
                      ))}
                    </ul>

                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Téléverser les documents</span>
                      </label>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="file-input file-input-bordered w-full"
                      />
                      {files.length > 0 && (
                        <label className="label">
                          <span className="label-text-alt text-success">
                            {files.length} fichier(s) sélectionné(s)
                          </span>
                        </label>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={!isFormValid}
                      className="btn btn-primary w-full mt-4"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Soumettre la demande
                    </button>
                  </>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    Veuillez sélectionner un document à gauche pour commencer
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Requests List */}
      {requests.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">Mes demandes</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {requests.map((request) => (
              <div key={request.id} className="card bg-base-100 shadow">
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{request.document}</h3>
                      <p className="text-sm text-gray-600">{request.description}</p>
                    </div>
                    {renderStatusBadge(request.status)}
                  </div>

                  <div className="divider my-2"></div>

                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-gray-600">Date de demande:</span>{' '}
                      {request.submissionDate}
                    </p>
                    <p>
                      <span className="text-gray-600">Date souhaitée:</span> {request.requestDate}
                    </p>
                    <p>
                      <span className="text-gray-600">Délai de traitement:</span>{' '}
                      {request.processingTime}
                    </p>
                  </div>

                  {/* File list */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Documents joints:</h4>
                    <div className="flex flex-wrap gap-2">
                      {request.files.map((file, index) => (
                        <span key={index} className="badge badge-ghost">
                          {file}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
