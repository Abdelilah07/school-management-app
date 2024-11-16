import { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches] = useState([
    'Course Management',
    'Student Records',
    'Grade Reports',
    'Class Schedule',
  ]);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleKeyDown = useCallback(
    (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
      if (e.key === 'Escape' && searchFocused) {
        document.getElementById('search-input')?.blur();
      }
    },
    [searchFocused]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    document.getElementById('search-input')?.focus();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          id="search-input"
          type="search"
          placeholder="Search..."
          className="input input-bordered w-full h-10 pl-10 pr-12 text-sm rounded-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
          aria-label="Search"
          autoComplete="off"
        />
        <Search
          className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60"
          aria-hidden="true"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {searchQuery === '' ? (
            <div className="hidden sm:flex items-center gap-1 font-mono text-[10px] font-medium opacity-60">
              <kbd className="h-5 select-none rounded border bg-base-200 px-1.5">
                {navigator.platform.indexOf('Mac') !== -1 ? '⌘' : 'ctrl'}
              </kbd>
              <kbd className="h-5 select-none rounded border bg-base-200 px-1.5">K</kbd>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-ghost btn-xs text-base-content/60 p-0"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {searchFocused && (
        <div
          className="absolute top-full inset-x-0 mt-2 bg-base-100 rounded-lg shadow-lg border border-base-200 overflow-hidden z-50 mx-2 sm:mx-0"
          role="listbox"
        >
          <div className="p-2 max-h-[60vh] sm:max-h-[300px] overflow-y-auto">
            {searchQuery ? (
              <div className="space-y-1">
                <div className="text-xs font-medium text-base-content/60 px-2 py-1">
                  Search Results
                </div>
                <button
                  className="flex items-center gap-2 w-full p-3 hover:bg-base-200 active:bg-base-300 rounded-md text-sm transition-colors"
                  role="option"
                  onClick={handleSubmit}
                >
                  <Search className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">Results for "{searchQuery}"</span>
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-xs font-medium text-base-content/60 px-2 py-1">
                  Recent Searches
                </div>
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    className="flex items-center gap-2 w-full p-3 hover:bg-base-200 active:bg-base-300 rounded-md text-sm transition-colors"
                    onClick={() => setSearchQuery(search)}
                    role="option"
                  >
                    <Search className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    <span className="truncate">{search}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
