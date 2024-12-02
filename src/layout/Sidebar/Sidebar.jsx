import { memo, useEffect, useRef, useContext, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { LayoutContext } from '../context/LayoutContext';
import { MenuItem, Divider, UserProfile } from './components';
import menuItems from './config/menuItems';
import { getUserFromStorage } from '../../utils';

const rolePermissions = {
  'super user': [
    'Home',
    'Courses',
    'Quizzes',
    'Attendance',
    'Schedule',
    'Documents',
    'Demandes',
    'Scheduler',
    'Specializations',
    'Competences',
    'Secteurs',
    'Groups',
    'Modules',
    'Settings',
    'Trainees',
    'Formateurs',
  ],
  admin: [
    'Home',
    'Attendance',
    'Documents',
    'Demandes',
    'Scheduler',
    'Specializations',
    'Competences',
    'Secteurs',
    'Groups',
    'Modules',
    'Trainees',
    'Formateurs',
  ],
  trainer: ['Home', 'Courses', 'Quizzes', 'Trainees', 'Attendance', 'Schedule', 'Documents'],
  trainee: ['Home', 'Courses', 'Quizzes', 'Schedule', 'Documents'],
};

const getFilteredMenuItems = (role) => {
  const allowedLabels = rolePermissions[role] || [];
  return menuItems.filter(
    (item, index, array) =>
      (item.type === 'divider' && index === array.length - 1) ||
      (item.label && allowedLabels.includes(item.label))
  );
};

const TRANSITION_DURATION = 300; // matches duration in classes

// Custom hook for handling sidebar close events with cleanup
const useSidebarCloseHandlers = (sidebarRef, context) => {
  const location = useLocation();
  const { isSidebarOpen, setIsSidebarOpen, isMobile } = context;

  const handleClickOutside = useCallback(
    (event) => {
      const isToggleButton = event.target.closest('[data-sidebar-toggle]');
      const isInsideSidebar = sidebarRef.current?.contains(event.target);

      if (!isToggleButton && !isInsideSidebar) {
        setIsSidebarOpen(false);
      }
    },
    [setIsSidebarOpen]
  );

  const handleEscKey = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    },
    [setIsSidebarOpen]
  );

  // Handle click outside and ESC key
  useEffect(() => {
    if (!isMobile || !isSidebarOpen) return undefined;

    document.addEventListener('mousedown', handleClickOutside, { passive: true });
    document.addEventListener('keydown', handleEscKey, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isSidebarOpen, isMobile, handleClickOutside, handleEscKey]);

  // Close sidebar on mobile navigation
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile, setIsSidebarOpen]);
};

// Component for the sidebar overlay
const SidebarOverlay = memo(({ isVisible, onClose }) => (
  <div
    className={`
      fixed inset-0 bg-black/20 backdrop-blur-sm z-20
      transition-opacity duration-300
      ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `.trim()}
    onClick={onClose}
    onKeyDown={(e) => e.key === 'Enter' && onClose()}
    role="button"
    tabIndex={isVisible ? 0 : -1}
    aria-label="Close sidebar"
    aria-hidden={!isVisible}
  />
));

SidebarOverlay.displayName = 'SidebarOverlay';

// Component for the sidebar content
const SidebarContent = memo(({ menuItems, location, userData }) => (
  <>
    <nav className="flex-1 px-4 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-base-300">
      <ul className="space-y-1" role="menu">
        {menuItems.map((item, index) => {
          if (item.type === 'divider') {
            return <Divider key={`divider-${index}`} />;
          }

          return (
            <MenuItem
              key={item.href || `menu-item-${index}`}
              item={item}
              isActive={location.pathname === item.href}
              aria-current={location.pathname === item.href ? 'page' : undefined}
            />
          );
        })}
      </ul>
    </nav>

    <div className="p-4 border-t border-base-200">
      <UserProfile
        name={userData?.name ?? 'Guest'}
        role={userData?.role ?? 'User'}
        profile_picture={userData?.profile_picture ?? ''}
      />
    </div>
  </>
));

SidebarContent.displayName = 'SidebarContent';

const Sidebar = memo(() => {
  const sidebarRef = useRef(null);
  const layoutContext = useContext(LayoutContext);
  const userData = getUserFromStorage('user');
  const location = useLocation();
  const filteredMenuItems = getFilteredMenuItems(userData?.role ?? 'user');

  if (!layoutContext) {
    console.error('Sidebar: LayoutContext is missing');
    return null; // Render nothing instead of throwing
  }

  const { isSidebarOpen, isMobile, setIsSidebarOpen } = layoutContext;

  // Initialize hooks
  useSidebarCloseHandlers(sidebarRef, layoutContext);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setIsSidebarOpen(false);
    }
  };

  const sidebarClasses = `
    fixed rounded-2xl top-20 
    h-[calc(100vh-5.5rem)] 
    bg-base-100 border-r border-base-200
    transition-transform duration-${TRANSITION_DURATION} ease-in-out
    w-64
    ${isMobile ? 'z-30' : 'z-20 lg:translate-x-2'}
    ${!isSidebarOpen && (isMobile || !isMobile) ? '-translate-x-full' : 'translate-x-2'}
  `.trim();

  return (
    <>
      <SidebarOverlay
        isVisible={isSidebarOpen && isMobile}
        onClose={() => setIsSidebarOpen(false)}
      />

      <aside
        ref={sidebarRef}
        className={sidebarClasses}
        aria-hidden={!isSidebarOpen}
        aria-label="Main navigation"
        role="navigation"
        onKeyDown={handleKeyDown}
      >
        <div className="h-full flex flex-col">
          <SidebarContent menuItems={filteredMenuItems} location={location} userData={userData} />
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
