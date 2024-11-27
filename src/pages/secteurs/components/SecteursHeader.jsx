import React from 'react';
import { RefreshCw, Download, Plus, Search } from 'lucide-react';

const SecteursHeader = ({ onRefresh, onExport, onAdd, onSearch, onFilterChange }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <div className="flex-1 w-full md:w-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher..."
            onChange={(e) => onSearch(e.target.value)}
            className="input input-bordered w-full pl-10"
          />
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={onRefresh} className="btn btn-ghost btn-sm">
          <RefreshCw className="h-5 w-5" />
          <span className="hidden md:inline">Actualiser</span>
        </button>

        <button onClick={onExport} className="btn btn-ghost btn-sm">
          <Download className="h-5 w-5" />
          <span className="hidden md:inline">Exporter</span>
        </button>

        <button onClick={onAdd} className="btn btn-primary btn-sm">
          <Plus className="h-5 w-5" />
          <span className="hidden md:inline">Nouveau secteur</span>
        </button>
      </div>
    </div>
  );
};

export default SecteursHeader;
