import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeSidebar } from '../features/sidebar/sidebarSlice';
import { toggleMobile } from '../features/ui/uiSlice';
import Navbar from './Navbar/Navbar';
import Sidebar from './Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

// Layout wrapper component
const DashboardLayout = () => {
  const { isOpen: isSidebarOpen } = useSelector((state) => state.sidebar);
  const { isMobile } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      const isMobileDevice = window.innerWidth < 1024;
      dispatch(toggleMobile(isMobileDevice));
      if (isMobileDevice) dispatch(closeSidebar());
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <Sidebar />
      <main
        className={`fixed overflow-auto h-[calc(100vh-5.5rem)] top-20 right-2 p-2 bg-base-100 rounded-lg transition-all duration-300 ${isMobile ? 'w-[calc(100vw-1rem)]' : 'w-[calc(100vw-17.5rem)]'}`}
      >
        <div className="p-2">
          <Outlet /> {/* Render nested route content here */}
        </div>
      </main>
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20" onClick={() => dispatch(closeSidebar())} />
      )}
    </div>
  );
};

export default DashboardLayout;
