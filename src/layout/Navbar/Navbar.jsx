import { SearchBar, SidebarToggle, UserMenu, NotificationsMenu, ThemeToggle } from './components';
import { Logo } from '../../assets/';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 p-2">
      <nav className="bg-base-100 border-b border-base-200 h-16 rounded-lg transition-all duration-300">
        <div className="max-w-[2000px] mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full gap-4">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              {/* Sidebar Toggle Button */}
              <SidebarToggle />

              {/* Logo */}
              <Link to="/school-management-app/" className="flex items-center gap-1">
                <Logo className="w-12 h-12 text-primary" />
                <span className="font-semibold text-xl tracking-tight sm:text-2xl hidden sm:inline-block">
                  OFPPT
                </span>
              </Link>
            </div>

            {/* Search Section */}
            <SearchBar />

            {/* Right Section */}
            <div className="flex items-center gap-2">
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
