import { SearchFilter } from '../../../components';
import { Search, Filter } from 'lucide-react';
import { handleSearch } from '../hooks/useSecteursLogic';

const SecteursSearch = ({ searchTerm, filters, onSearchChange, onFilterChange }) => (
  <SearchFilter
    searchTerm={searchTerm}
    filters={filters}
    onSearchChange={onSearchChange}
    onFilterChange={onFilterChange}
    searchPlaceholder="Rechercher par code ou intitulé..."
    icons={{ SearchIcon: Search }}
  />
);

export default SecteursSearch;
