import { ChevronDown, LogOut, MessageSquare, UserCircle2 } from 'lucide-react';
import { Avatar } from '../../../assets';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../features/auth/slices/authSlice';

const UserMenu = () => {
  const dispatch = useDispatch();
  const user =
    (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))) ||
    (sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user'))) ||
    null;

  return (
    <div className="dropdown dropdown-bottom dropdown-end">
      <button className="btn btn-ghost btn-sm sm:btn-md p-1 sm:p-2">
        <div className="avatar">
          <div className="w-7 sm:w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img src={Avatar} alt="Profile" />
          </div>
        </div>
        <span className="hidden sm:inline-block ml-2">{user?.name}</span>
        <ChevronDown className="hidden sm:inline-block w-4 h-4 ml-1" />
      </button>
      <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-sm">
        <li>
          <Link to="/messages" className="gap-3">
            <MessageSquare className="w-4 h-4" /> Messages
          </Link>
        </li>
        <li>
          <Link to="/user-profile" className="gap-3">
            <UserCircle2 className="w-4 h-4" /> Profile
          </Link>
        </li>
        <li>
          <button onClick={() => dispatch(logout())} className="gap-3">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserMenu;
