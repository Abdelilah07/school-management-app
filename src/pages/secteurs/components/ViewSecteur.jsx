const ViewSecteur = ({ secteur, onClose, onDelete }) => {
  if (!secteur) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Détails du secteur</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">
            <span className="label-text">Code secteur</span>
          </label>
          <div className="text-sm">{secteur.code_secteur}</div>
        </div>

        <div>
          <label className="label">
            <span className="label-text">Intitulé</span>
          </label>
          <div className="text-sm">{secteur.intitule_secteur}</div>
        </div>

        <div>
          <label className="label">
            <span className="label-text">Secteur</span>
          </label>
          <div className="text-sm">{secteur.secteur}</div>
        </div>

        <div>
          <label className="label">
            <span className="label-text">Groupes</span>
          </label>
          <div className="text-sm">
            {Array.isArray(secteur.groupes) ? secteur.groupes.join(', ') : secteur.groupes}
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
