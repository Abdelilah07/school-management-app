import React, { useState } from 'react';
import {PhotoIcon} from "@heroicons/react/24/solid";

const DocumentComponent = () => {
    const documentList = [
        {
            id: 1,
            name: "Attestation de présence",
            documentattachment: [
                "Carte d'identité",
                "Lettre de demande de document"
            ]
        },
        {
            id: 2,
            name: "Attestation de fin de formation",
            documentattachment: [
                "Carte d'identité",
                "Lettre de demande de document",
                "Certificat de stage"
            ]
        },
        {
            id: 3,
            name: "Relevé de notes",
            documentattachment: [
                "Carte d'identité",
                "Lettre de demande de document",
                "Attestation de présence"
            ]
        },
        {
            id: 4,
            name: "Certificat de stage",
            documentattachment: [
                "Carte d'identité",
                "Lettre de demande de stage en entreprise"
            ]
        },
        {
            id: 5,
            name: "Demande de stage",
            documentattachment: [
                "Lettre de motivation",
                "CV"
            ]
        },
        {
            id: 6,
            name: "Convention de stage",
            documentattachment: [
                "Carte d'identité",
                "Lettre de demande de stage",
                "Attestation de présence"
            ]
        },
        {
            id: 7,
            name: "Demande de remboursement",
            documentattachment: [
                "Carte d'identité",
                "Justificatif de paiement",
                "Attestation de présence"
            ]
        },
        {
            id: 8,
            name: "Carte d’étudiant ou de stagiaire",
            documentattachment: [
                "Photo d'identité",
                "Carte d'identité",
                "Attestation d'inscription"
            ]
        },
        {
            id: 9,
            name: "Demande de diplôme ou de certificat",
            documentattachment: [
                "Carte d'identité",
                "Relevé de notes",
                "Attestation de fin de formation"
            ]
        },
        {
            id: 10,
            name: "Attestation de stage de fin d’études",
            documentattachment: [
                "Carte d'identité",
                "Rapport de stage",
                "Attestation de fin de formation"
            ]
        }
    ];


    const statusList = [
        { id: 1, name: "En cours", color: 'gold' },
        { id: 2, name: "En attente", color: 'blue' },
        { id: 3, name: "Valide", color: 'green' },
        { id: 4, name: "Refus", color: 'red' },
    ];

    const [selectedDocument, setSelectedDocument] = useState(null);
    const [time, setTime] = useState('');
    const [file, setFile] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [status] = useState(1);
    const [demandes, setDemandes] = useState([]);

    const handleDocumentChange = (event) => {
        const selectedDocumentId = Number(event.target.value);
        const selectedDocument = documentList.find(document => document.id === selectedDocumentId);
        setSelectedDocument(selectedDocument);
    }

    const handleTimeChange = (event) => {
        setTime(event.target.value);
    }

    const handleFileChange = (event) => {
        setFile(event.target.files);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const demande = {
            id: demandes.length + 1,
            document: selectedDocument.name,
            time: time,
            file: file,
            status: status
        };
        setDemandes([...demandes, demande]);
        setShowDetails(true);
    };

    const isDisabled = selectedDocument === null || time === '' || file === null;

    const getStatusColor = (statusId) => {
        const status = statusList.find(s => s.id === statusId);
        return status ? status.color : 'gray';
    };

    return (
        <div className="mb-10">
            <h1 className='text-xl font-bold'>Demande de document</h1>
            <hr className='my-4'/>
            <form className="w-full" onSubmit={handleSubmit}>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label htmlFor="document" className="block text-sm font-medium">Document</label>
                        <select onChange={handleDocumentChange} className="w-full px-4 py-2 mt-2 text-base transition duration-150 ease-in-out bg-transparent border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <option value="" disabled selected>Select a document</option>
                            {documentList.map((document) => (
                                <option key={document.id} value={document.id}>{document.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label htmlFor="time" className="block text-sm font-medium">Date de demande</label>
                        <input type="date" value={time} onChange={handleTimeChange} className="w-full px-4 py-2 mt-2 text-base transition duration-150 ease-in-out bg-transparent border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>
                {selectedDocument && (
                    <>
                        <div className="mt-2 border border-gray-300 rounded-md p-4">
                            <p className="mb-2 text-sm text-red-500">S'il vous plait ajouter des fichiers suivants :</p>
                            <hr className='my-2'/>
                            <ul className="list-inside list-none">
                                {selectedDocument.documentattachment.map((documentattachment) => (
                                    <li className="list-inside" key={documentattachment}>{documentattachment}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                                <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
                                <div className="mt-4 flex text-sm/6 text-gray-600">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                    >
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" onChange={handleFileChange} accept=".pdf" className="sr-only" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs/5 text-gray-600">PDF up to 10MB</p>
                            </div>
                        </div>
                    </>
                )}
                {file && file.length > 0 && (
                  <p className='mt-2 text-sm '>{file.length} fichier(s) importé(s)</p>
                )}
                <button type="submit" disabled={isDisabled} className="w-full flex justify-center py-2 px-4 mt-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-success hover:bg-success-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success focus:ring-offset-white disabled:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Envoyer</button>
            </form>

            {showDetails && (
                <ul className="list-inside list-none mt-2 flex flex-wrap">
                    {demandes.map((demande) => (
                        <li className="mt-4 mx-3 border border-gray-300 rounded-md p-4 flex flex-col justify-between" key={demande.id}>
                            <div>
                                <h2 className="text-lg font-medium">Détails de la Demande</h2>
                                <hr className="my-2" />
                                <p>Document: {demande.document}</p>
                                <p>Date de demande: {demande.time}</p>
                            </div>
                            <p className="text-lg font-medium mt-2" style={{color: getStatusColor(demande.status)}}>{statusList.find(s => s.id === demande.status).name}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default DocumentComponent;


