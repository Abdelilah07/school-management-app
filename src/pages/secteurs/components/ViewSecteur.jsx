import { KeyRound, BookText, Album } from 'lucide-react';
const ViewSecteur = ({ secteur, onClose, onDelete }) => {
  if (!secteur) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Détails du secteur</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">
            <span className="label-text">
              <KeyRound color="red" size={15} />
              Code secteur
            </span>
          </label>
          <div className="text-sm">{secteur.code_secteur}</div>
        </div>

        <div>
          <label className="label">
            <span className="label-text">
              <Album color="red" size={15} />
              Intitulé
            </span>
          </label>
          <div className="text-sm">{secteur.intitule_secteur}</div>
        </div>

        <div>
          <label className="label">
            <span className="label-text">
              <BookText color="red" size={15} />
              Filieres
            </span>
          </label>
          <div className="text-sm">
            {Array.isArray(secteur.filieres) ? secteur.filieres.join(', ') : secteur.filieres}
          </div>
        </div>
      </div>

      <div className="modal-action">
        <button onClick={onClose} className="btn">
          Fermer
        </button>
        <button onClick={() => onDelete(secteur)} className="btn btn-error">
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default ViewSecteur;
