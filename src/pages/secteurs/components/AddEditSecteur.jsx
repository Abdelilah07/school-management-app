import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Album, BookOpenText, KeyRound } from 'lucide-react';
const AddEditSecteur = ({ secteur, onClose, onSave, isEditMode }) => {
  const [formData, setFormData] = useState({
    id_secteur: '',
    code_secteur: '',
    intitule_secteur: '',
    filieres: '',
  });

  useEffect(() => {
    if (secteur) {
      setFormData({
        id_secteur: secteur.id,
        code_secteur: secteur.code_secteur || '',
        intitule_secteur: secteur.intitule_secteur || '',
        filieres: Array.isArray(secteur.filieres)
          ? secteur.filieres.join(', ')
          : secteur.filieres || '',
      });
    }
  }, [secteur]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const secteurData = {
        ...formData,
        filieres: formData.filieres
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
          <span className="label-text">
            <KeyRound color="red" size={15} />
            Code secteur
          </span>
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
          <span className="label-text">
            <Album color="red" size={15} />
            Intitulé
          </span>
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
          <span className="label-text">
            <BookOpenText color="red" size={15} />
            Filieres (séparés par des virgules)
          </span>
        </label>
        <input
          type="text"
          name="groupes"
          value={formData.filieres}
          onChange={(e) => setFormData((prev) => ({ ...prev, filieres: e.target.value }))}
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

AddEditSecteur.propTypes = {
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  secteur: PropTypes.shape({
    id: PropTypes.string,
    code_secteur: PropTypes.string,
    intitule_secteur: PropTypes.string,
    filieres: PropTypes.array,
  }),
};

export default AddEditSecteur;
