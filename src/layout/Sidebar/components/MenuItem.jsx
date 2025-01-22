import { NavLink } from 'react-router';
import PropTypes from 'prop-types';
import * as Icons from 'lucide-react';
import { useContext, useMemo } from 'react';
import { LayoutContext } from '../../context/LayoutContext';

const MenuItem = ({ item }) => {
  const { isSidebarOpen } = useContext(LayoutContext);

  // Memoize the Icon component to prevent unnecessary re-renders
  const IconComponent = useMemo(() => Icons[item.icon] || (() => null), [item.icon]);

  return (
    <li>
      <NavLink
        to={item.href}
        className={({ isActive }) =>
          `group flex items-center gap-x-3 px-3 py-2 rounded-lg transition-colors duration-300 ease-in-out
           ${isActive ? 'bg-primary text-primary-content hover:bg-primary/90' : 'hover:bg-base-200 text-base-content'}`
        }
        aria-label={item.label} // Accessibility for collapsed sidebar
      >
        {({ isActive }) => (
          <>
            {/* Icon with fixed width to prevent flickering */}
            <span className="min-w-6 flex justify-center">
              <IconComponent className="transition-colors duration-300 ease-in-out text-base" />
            </span>

            {/* Label - Only visible when sidebar is open */}
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out leading-none
                          ${isSidebarOpen ? 'opacity-100 scale-100 w-24' : 'opacity-0 scale-95 w-0'}
                        `}
            >
              {item.label}
            </span>

            {/* Optional Badge/Count */}
            {item.count !== undefined && (
              <span
                className={`px-2 py-0.5 text-xs rounded-full
                  ${isActive ? 'bg-primary-content/20 text-primary-content' : 'bg-base-300 text-base-content'}
                `}
              >
                {item.count}
              </span>
            )}
            {item.badge && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-accent text-accent-content">
                {item.badge}
              </span>
            )}
          </>
        )}
      </NavLink>
    </li>
  );
};

MenuItem.propTypes = {
  item: PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    icon: PropTypes.string,
    count: PropTypes.number,
    badge: PropTypes.string,
  }).isRequired,
};

export default MenuItem;
