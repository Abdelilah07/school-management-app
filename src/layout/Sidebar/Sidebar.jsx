import { memo, useEffect, useRef, useContext, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router';
import { LayoutContext } from '../context/LayoutContext';
import { MenuItem, Divider, UserProfile } from './components';
import menuItems from './config/menuItems';
import { getUserFromStorage } from '../../utils';
import { ROLE_PERMISSIONS } from '../Sidebar/config/rolePermissions';

// Filters menu items based on user role
const getFilteredMenuItems = (role, items) => {
  const allowed = ROLE_PERMISSIONS[role] || new Set();

  return items
    .filter((item) => item.type === 'divider' || (item.label && allowed.has(item.label)))
    .filter(
      (item, i, arr) =>
        item.type !== 'divider' ||
        (i > 0 &&
          i < arr.length - 1 &&
          arr[i - 1].type !== 'divider' &&
          arr[i + 1]?.type !== 'divider')
    );
};

// Handles closing the sidebar when clicking outside or pressing Escape
const useSidebarCloseHandlers = (sidebarRef, isSidebarOpen, setIsSidebarOpen, isMobile) => {
  const location = useLocation();

  const handleClickOutside = useCallback(
    (event) => {
      if (!isMobile) return;
      if (
        !sidebarRef.current?.contains(event.target) &&
        !event.target.closest('[data-sidebar-toggle]')
      ) {
        setIsSidebarOpen(false);
      }
    },
    [setIsSidebarOpen, isMobile, sidebarRef]
  );

  const handleEscKey = useCallback(
    (event) => {
      if (event.key === 'Escape' && isMobile) {
        setIsSidebarOpen(false);
      }
    },
    [setIsSidebarOpen, isMobile]
  );

  useEffect(() => {
    if (!isSidebarOpen) return;
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('keydown', handleEscKey, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('keydown', handleEscKey, true);
    };
  }, [isSidebarOpen, handleClickOutside, handleEscKey]);

  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile, setIsSidebarOpen]);
};

// Sidebar overlay for mobile view
const SidebarOverlay = memo(({ isVisible, onClose }) => (
  <div
    className={`fixed inset-0 bg-black/30 backdrop-blur-xs z-10 transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}
    onClick={onClose}
    role="button"
    tabIndex={isVisible ? 0 : -1}
    aria-hidden={!isVisible}
  />
));
SidebarOverlay.displayName = 'SidebarOverlay';

// Sidebar menu content
const SidebarContent = memo(({ menuItems, userData, isSidebarOpen }) => (
  <>
    <nav className="flex-1 px-4 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-base-300">
      <ul className="space-y-1" role="menu">
        {menuItems.map((item, index) =>
          item.type === 'divider' ? (
            <Divider key={`divider-${index}`} />
          ) : (
            <MenuItem key={item.href || `item-${index}`} item={item} />
          )
        )}
      </ul>
    </nav>

    <div
      className={`transition-all duration-300 overflow-hidden ${isSidebarOpen ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}
    >
      <div className="p-4 border-t border-base-200">
        <UserProfile
          name={userData?.name ?? 'Guest'}
          role={userData?.roles[0] ?? 'User'}
          profile_picture={`${import.meta.env.VITE_BACKEND_URL}/storage/${userData?.profile_picture}`}
        />
      </div>
    </div>
  </>
));
SidebarContent.displayName = 'SidebarContent';

// Main Sidebar Component
const Sidebar = memo(() => {
  const sidebarRef = useRef(null);
  const { isSidebarOpen, setIsSidebarOpen, isMobile } = useContext(LayoutContext);
  const userData = getUserFromStorage('user');

  const filteredMenuItems = useMemo(
    () => getFilteredMenuItems(userData?.roles[0] ?? 'user', menuItems),
    [userData?.roles[0]]
  );

  useSidebarCloseHandlers(sidebarRef, isSidebarOpen, setIsSidebarOpen, isMobile);

  // Sidebar styling
  const sidebarClasses = cn(
    "fixed left-2 top-20 bottom-2 rounded-box bg-base-100 transition-all duration-300 ease-in-out z-20 shadow-md",
    isMobile 
      ? isSidebarOpen 
        ? "w-64 shadow-lg" 
        : "-translate-x-[16.5rem] w-0"
      : isSidebarOpen 
        ? "w-64" 
        : "w-20"
  );

  return (
    <>
      <SidebarOverlay
        isVisible={isSidebarOpen && isMobile}
        onClose={() => setIsSidebarOpen(false)}
      />

      <aside
        ref={sidebarRef}
        className={sidebarClasses}
        aria-hidden={isMobile && !isSidebarOpen}
        role="navigation"
        aria-label="Main Navigation"
      >
        <div className="h-full flex flex-col">
          <SidebarContent
            menuItems={filteredMenuItems}
            userData={userData}
            isSidebarOpen={isSidebarOpen}
          />
        </div>
      </aside>
    </>
  );
});
Sidebar.displayName = 'Sidebar';

export default Sidebar;
