import { NavLink } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Users,
  Calendar,
  BarChart,
  FileText,
  Settings,
  BookMarked,
} from 'lucide-react';
import PropTypes from 'prop-types';

const ICONS = {
  Home,
  BookOpen,
  Users,
  Calendar,
  BarChart,
  FileText,
  Settings,
  BookMarked,
};

const MenuItem = ({ item }) => {
  const IconComponent = ICONS[item.icon] || ICONS.Home;

  return (
    <li>
      <NavLink
        to={item.href}
        className={({ isActive }) =>
          `group flex items-center gap-x-3 px-3 py-2 rounded-lg
           hover:bg-base-200 transition-colors
           ${isActive ? 'bg-primary text-primary-content hover:bg-primary/90' : 'text-base-content'}`
        }
      >
        {({ isActive }) => (
          <>
            <IconComponent
              className={`w-5 h-5 ${isActive ? 'text-current' : 'text-base-content/70'}`}
            />
            <span className="flex-1">{item.label}</span>
            {item.count !== undefined && (
              <span
                className={`px-2 py-0.5 text-xs rounded-full
                  ${
                    isActive
                      ? 'bg-primary-content/20 text-primary-content'
                      : 'bg-base-300 text-base-content'
                  }`}
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
    icon: PropTypes.oneOf(Object.keys(ICONS)),
    count: PropTypes.number,
    badge: PropTypes.string,
  }).isRequired,
};

export default MenuItem;
