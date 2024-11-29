import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function FiltersFormateur({
  secteursData,
  secteur,
  niveau,
  filiere,
  annee,
  groupe,
  dateFilter,
  onSecteurChange,
  onNiveauChange,
  onFiliereChange,
  onAnneeChange,
  onGroupeChange,
  onDateChange,
  onClearFilters,
  showExport = true,
}) {
  const [availableNiveaux, setAvailableNiveaux] = useState([]);
  const [availableFilieres, setAvailableFilieres] = useState([]);
  const [availableAnnees, setAvailableAnnees] = useState([]);
  const [availableGroupes, setAvailableGroupes] = useState([]);

  useEffect(() => {
    const selectedSecteur = secteursData.find((s) => s.intitule_secteur === secteur);
    if (selectedSecteur) {
      setAvailableNiveaux(Object.keys(selectedSecteur.niveaux || {}));
    } else {
      setAvailableNiveaux([]);
    }
    setAvailableFilieres([]);
    setAvailableAnnees([]);
    setAvailableGroupes([]);
  }, [secteur, secteursData]);

  useEffect(() => {
    const selectedSecteur = secteursData.find((s) => s.intitule_secteur === secteur);
    if (selectedSecteur && niveau) {
      const niveauxData = selectedSecteur.niveaux[niveau];
      setAvailableFilieres(Object.keys(niveauxData?.filiere || {}));
    } else {
      setAvailableFilieres([]);
    }
    setAvailableAnnees([]);
    setAvailableGroupes([]);
  }, [niveau, secteur, secteursData]);

  useEffect(() => {
    const selectedSecteur = secteursData.find((s) => s.intitule_secteur === secteur);
    if (selectedSecteur && niveau && filiere) {
      const filiereData = selectedSecteur.niveaux[niveau]?.filiere[filiere];
      setAvailableAnnees(Object.keys(filiereData || {}));
    } else {
      setAvailableAnnees([]);
    }
    setAvailableGroupes([]);
  }, [filiere, niveau, secteur, secteursData]);

  useEffect(() => {
    const selectedSecteur = secteursData.find((s) => s.intitule_secteur === secteur);
    if (selectedSecteur && niveau && filiere && annee) {
      const anneeData = selectedSecteur.niveaux[niveau]?.filiere[filiere]?.[annee];
      setAvailableGroupes(Object.keys(anneeData || {}));
    } else {
      setAvailableGroupes([]);
    }
  }, [annee, filiere, niveau, secteur, secteursData]);

  const clearAllFilters = () => {
    onSecteurChange('');
    onNiveauChange('');
    onFiliereChange('');
    onAnneeChange('');
    onGroupeChange('');
    onDateChange({ target: { value: '' } });
  };

  const renderSelect = (value, onChange, options, placeholder) => (
    <select
      className="select select-bordered select-sm w-full"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );

  return (
    <div className="bg-base-200 p-4 rounded-lg shadow-md mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        {renderSelect(
          secteur,
          onSecteurChange,
          secteursData.map((s) => s.intitule_secteur),
          'Secteur'
        )}
        {renderSelect(niveau, onNiveauChange, availableNiveaux, 'Niveau')}
        {renderSelect(filiere, onFiliereChange, availableFilieres, 'Filière')}
        {renderSelect(annee, onAnneeChange, availableAnnees, 'Année')}
        {renderSelect(groupe, onGroupeChange, availableGroupes, 'Groupe')}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <input
          type="date"
          className="input input-bordered input-sm w-full"
          value={dateFilter}
          onChange={onDateChange}
        />
      </div>

      <div className="flex justify-center space-x-2 mt-4">
        <button className="btn btn-secondary btn-sm" onClick={clearAllFilters}>
          <X className="mr-2" size={16} />
          Effacer les filtres
        </button>
      </div>
    </div>
  );
}
