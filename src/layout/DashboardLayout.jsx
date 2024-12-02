import { useContext } from 'react';
import { LayoutProvider, LayoutContext } from './context/LayoutContext';
import Navbar from './Navbar/Navbar';
import Sidebar from './Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardContent = () => {
  const { isMobile, isSidebarOpen, setIsSidebarOpen } = useContext(LayoutContext);

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <Navbar />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main
        className={`
          fixed overflow-y-auto
          h-[calc(100vh-5.5rem)] 
          top-20 right-2 p-4
          bg-base-100 rounded-2xl
          transition-all duration-300 ease-in-out
          ${isMobile ? `left-2 ${isSidebarOpen ? 'opacity-50' : 'opacity-100'}` : 'left-[17rem]'}
        `}
      >
        {/* Main Outlet */}
        <Outlet />
      </main>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

const DashboardLayout = () => {
  return (
    <LayoutProvider>
      <DashboardContent />
    </LayoutProvider>
  );
};

export default DashboardLayout;
