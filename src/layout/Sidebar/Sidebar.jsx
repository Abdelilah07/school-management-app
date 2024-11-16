import { memo, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeSidebar } from '../../features/sidebar/sidebarSlice';
import { toggleMobile } from '../../features/ui/uiSlice';
import { MenuItem, Divider, UserProfile } from './components';
import { useLocation } from 'react-router-dom';
import avatar from '../../assets/avatar.png';

const Sidebar = memo(() => {
  const dispatch = useDispatch();
  const location = useLocation();
  const sidebarRef = useRef(null);
  const { isOpen, items } = useSelector((state) => state.sidebar);
  const { isMobile } = useSelector((state) => state.ui);

  // Get the user data from local storage
  const user = (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))) ||
    (sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user'))) || {
      name: '',
      role: '',
    };

  // Handle click outside and escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest('[data-sidebar-toggle]')
      ) {
        dispatch(closeSidebar());
      }
    };

    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isMobile && isOpen) {
        dispatch(closeSidebar());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isMobile, isOpen, dispatch]);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile && isOpen) {
      dispatch(closeSidebar());
    }
  }, [location, isMobile, dispatch]);

  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      const isMobileDevice = window.innerWidth < 1024;
      dispatch(toggleMobile(isMobileDevice));
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  const sidebarPositionClasses = `
    fixed rounded-lg top-20 
    h-[calc(100vh-5.5rem)] 
    bg-base-100 border-r border-base-200
    transition-all duration-300 z-30
    ${isOpen ? 'left-2' : '-left-64'}
    ${isMobile ? 'w-64' : 'w-64 lg:left-2 lg:z-20'}
    ${!isOpen && !isMobile ? 'lg:-left-64' : ''}
  `.trim();

  const menuContent = items.map((item, index) =>
    item.type === 'divider' ? (
      <Divider key={`divider-${index}`} />
    ) : (
      <MenuItem key={item.href || item.label} item={item} />
    )
  );

  const overlayClasses = `
    fixed inset-0 bg-black/20 backdrop-blur-sm z-20
    transition-opacity duration-300
    ${isOpen && isMobile ? 'opacity-100' : 'opacity-0 pointer-events-none'}
  `.trim();

  return (
    <>
      <div className={overlayClasses} onClick={() => dispatch(closeSidebar())} aria-hidden="true" />

      <aside ref={sidebarRef} className={sidebarPositionClasses}>
        <div className="h-full flex flex-col">
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-1">{menuContent}</ul>
          </nav>

          <div className="p-4 border-t border-base-200">
            <UserProfile name={user.name} role={user.role} avatar={avatar} />
          </div>
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
