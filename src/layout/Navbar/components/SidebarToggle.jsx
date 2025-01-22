import { useContext } from 'react';
import { Menu } from 'lucide-react';
import { LayoutContext } from '../../context/LayoutContext'; // Ensure the correct path to LayoutContext

const SidebarToggle = () => {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error('SidebarToggle must be used within a LayoutProvider');
  }

  const { isSidebarOpen, setIsSidebarOpen } = context;

  return (
    <div
      className="tooltip tooltip-right z-50"
      data-tip={`${isSidebarOpen ? 'Close' : 'Open'} sidebar`}
    >
      <button
        type="button"
        data-sidebar-toggle
        onClick={() => setIsSidebarOpen((prevState) => !prevState)}
        className="btn btn-ghost"
        aria-label={`${isSidebarOpen ? 'Close' : 'Open'} sidebar`}
        aria-expanded={isSidebarOpen}
        aria-controls="sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SidebarToggle;
