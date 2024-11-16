import { SearchBar, SidebarToggle, UserMenu, NotificationsMenu, ThemeToggle } from './components';
import { Logo } from '../../assets/';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 p-2">
      <nav className="bg-base-100 border-b border-base-200 h-14 sm:h-16 rounded-lg transition-all duration-300">
        <div className="max-w-[2000px] mx-auto px-2 sm:px-4 h-full">
          <div className="flex items-center justify-between h-full gap-2 sm:gap-4">
            {/* Left Section */}
            <div className="flex items-center gap-2 sm:gap-4">
              <SidebarToggle />
              <Link to="/school-management-app/" className="flex items-center gap-1">
                <Logo className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
                <span className="font-semibold text-lg sm:text-xl tracking-tight hidden sm:inline-block">
                  OFPPT
                </span>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
              <SearchBar />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1 sm:gap-2">
              <NotificationsMenu />
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
