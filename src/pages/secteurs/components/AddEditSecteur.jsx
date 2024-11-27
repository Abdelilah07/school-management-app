import { useState, useEffect } from 'react';

const AddEditSecteur = ({ secteur, onClose, onSave, isEditMode }) => {
  const [formData, setFormData] = useState({
    id_secteur: '',
    code_secteur: '',
    intitule_secteur: '',
    secteur: '',
    groupes: '',
  });

  useEffect(() => {
    if (secteur) {
      setFormData({
        id_secteur: secteur.id_secteur,
        code_secteur: secteur.code_secteur || '',
        intitule_secteur: secteur.intitule_secteur || '',
        secteur: secteur.secteur || '',
        groupes: Array.isArray(secteur.groupes) ? secteur.groupes.join(', ') : '',
      });
    }
  }, [secteur]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const secteurData = {
        ...formData,
        groupes: formData.groupes
          .split(',')
          .map((g) => g.trim())
          .filter(Boolean),
      };
      await onSave(secteurData);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">
        {isEditMode ? 'Modifier le secteur' : 'Nouveau secteur'}
      </h2>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Code secteur</span>
        </label>
        <input
          type="text"
          name="code_secteur"
          value={formData.code_secteur}
          onChange={(e) => setFormData((prev) => ({ ...prev, code_secteur: e.target.value }))}
          className="input input-bordered"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Intitulé</span>
        </label>
        <input
          type="text"
          name="intitule_secteur"
          value={formData.intitule_secteur}
          onChange={(e) => setFormData((prev) => ({ ...prev, intitule_secteur: e.target.value }))}
          className="input input-bordered"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Secteur</span>
        </label>
        <input
          type="text"
          name="secteur"
          value={formData.secteur}
          onChange={(e) => setFormData((prev) => ({ ...prev, secteur: e.target.value }))}
          className="input input-bordered"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Groupes (séparés par des virgules)</span>
        </label>
        <input
          type="text"
          name="groupes"
          value={formData.groupes}
          onChange={(e) => setFormData((prev) => ({ ...prev, groupes: e.target.value }))}
          className="input input-bordered"
        />
      </div>

      <div className="modal-action">
        <button type="button" onClick={onClose} className="btn">
          Annuler
        </button>
        <button type="submit" className="btn btn-primary">
          {isEditMode ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
    </form>
  );
};

export default AddEditSecteur;
