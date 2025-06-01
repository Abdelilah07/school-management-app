import { ChevronDown, LogOut, MessageSquare, UserCircle2 } from 'lucide-react';
import { Link } from 'react-router';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../../features/auth/slices/authSlice';
import { getUserFromStorage } from '../../../utils';

const UserMenu = () => {
  const dispatch = useDispatch();

  const user = getUserFromStorage('user');

  return (
    <div className="dropdown dropdown-bottom dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost avatar">
        <div className="w-7 rounded-full ring-3 ring-primary ring-offset-base-100 ring-offset-2">
          <img src={`${import.meta.env.VITE_BACKEND_URL}/storage/${user?.profile_picture}`} alt="Profile" />
        </div>
        <span className="hidden lg:inline-block ml-2">{user?.name || 'Guest'}</span>
        <ChevronDown className="hidden lg:inline-block w-4 h-4 ml-2" />
      </div>

      <ul className="dropdown-content menu p-2 shadow-sm bg-base-100 rounded-box w-52 text-sm">
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
          <button onClick={() => dispatch(logoutUser())} className="gap-3">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserMenu;
