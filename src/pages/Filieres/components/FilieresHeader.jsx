import { RefreshCcw, Plus, Download } from 'lucide-react';
import PropTypes from 'prop-types';

const FilieresHeader = ({ onRefresh, onExport, onAdd }) => (
  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
    <h1 className="text-2xl font-bold">Gestion des Filières</h1>
    <div className="flex gap-2">
      <button onClick={onRefresh} className="btn btn-ghost btn-sm tooltip" data-tip="Rafraîchir">
        <RefreshCcw className="w-4 h-4" />
      </button>
      <button onClick={onExport} className="btn btn-outline btn-primary btn-sm gap-2">
        <Download className="w-4 h-4" />
        Export CSV
      </button>
      <button onClick={onAdd} className="btn btn-primary btn-sm gap-2">
        <Plus className="w-4 h-4" />
        Nouvelle Filière
      </button>
    </div>
  </div>
);

FilieresHeader.propTypes = {
  onRefresh: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default FilieresHeader;
