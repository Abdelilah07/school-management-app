import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../../../features/sidebar/sidebarSlice';
import { Menu, X } from 'lucide-react';

const SidebarToggle = () => {
  const { isOpen } = useSelector((state) => state.sidebar);
  const { isMobile } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  if (!isMobile) return null;

  return (
    <button
      type="button"
      data-sidebar-toggle
      onClick={() => dispatch(toggleSidebar())}
      className="btn btn-ghost btn-square"
      aria-label={`${isOpen ? 'Close' : 'Open'} sidebar`}
      aria-expanded={isOpen}
    >
      {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
  );
};

export default SidebarToggle;
