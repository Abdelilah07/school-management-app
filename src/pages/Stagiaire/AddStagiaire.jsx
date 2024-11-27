import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addStagiaireAPI } from '../../features/Stagiaire/stagiaireSlice'; // Assurez-vous que ce chemin est correct

const AddStagiaire = () => {
  const dispatch = useDispatch();
  const [nom, setNom] = useState('');
  const [cefid, setCefid] = useState('');
  const [filiere, setFiliere] = useState('');
  const [groupe, setGroupe] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fonction pour gérer l'ajout d'un stagiaire
  const handleAddStagiaire = async (e) => {
    e.preventDefault();
    const stagiaire = { cef: cefid, nom, filiere, groupe };

    setLoading(true);
    setError(null);

    try {
      await dispatch(addStagiaireAPI(stagiaire)); // Envoi à l'API via Redux
      // Réinitialisation du formulaire
      setNom('');
      setCefid('');
      setFiliere('');
      setGroupe('');
    } catch (err) {
      setError("Erreur lors de l'ajout du stagiaire");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Ajouter un Stagiaire</h2>
      <form onSubmit={handleAddStagiaire}>
        <input
          type="text"
          value={cefid}
          onChange={(e) => setCefid(e.target.value)}
          placeholder="Cef"
          required
        />
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Nom"
          required
        />
        <input
          type="text"
          value={filiere}
          onChange={(e) => setFiliere(e.target.value)}
          placeholder="Filière"
          required
        />
        <input
          type="text"
          value={groupe}
          onChange={(e) => setGroupe(e.target.value)}
          placeholder="Groupe"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Ajout en cours...' : 'Ajouter'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AddStagiaire;
