import { Search, Filter } from 'lucide-react';
import PropTypes from 'prop-types';

const GroupesSearch = ({
  searchTerm,
  filterNiveau,
  niveaux = [],
  onSearchChange,
  onSectorChange,
}) => (
  <div className="flex flex-col sm:flex-row gap-4">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-4 h-4" />
      <input
        type="text"
        placeholder="Rechercher par code ou intitulé..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="input input-bordered w-full pl-10"
      />
    </div>
    <div className="flex gap-2 items-center">
      <Filter className="w-4 h-4 text-base-content/50" />
      <select
        value={filterNiveau}
        onChange={(e) => onSectorChange(e.target.value)}
        className="select select-bordered"
      >
        <option value="">Tous les Niveaux</option>
        {niveaux.map((niveau) => (
          <option key={niveau} value={niveau}>
            {niveau}
          </option>
        ))}
      </select>
    </div>
  </div>
);

GroupesSearch.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  filterNiveau: PropTypes.string.isRequired,
  niveaux: PropTypes.array.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onSectorChange: PropTypes.func.isRequired,
};

export default GroupesSearch;
