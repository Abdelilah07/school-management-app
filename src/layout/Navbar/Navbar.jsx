import { SearchBar, SidebarToggle, UserMenu, NotificationsMenu, ThemeToggle } from './components';
import { Logo } from '../../assets/';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 p-2">
      <nav className="navbar mx-auto rounded-2xl bg-base-100">
        {/* Left Section */}
        <div className="navbar-start gap-2">
          <SidebarToggle />
          <Link to="/" className="btn btn-ghost flex items-center gap-1 px-2">
            <Logo className="w-10 h-10" />
            <span className="font-semibold text-xl tracking-tight hidden sm:inline-block">
              OFPPT
            </span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="navbar-center px-2 max-w-2xl">
          <SearchBar />
        </div>

        {/* Right Section */}
        <div className="navbar-end gap-1 md:gap-2">
          <NotificationsMenu />
          <ThemeToggle />
          <UserMenu />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
