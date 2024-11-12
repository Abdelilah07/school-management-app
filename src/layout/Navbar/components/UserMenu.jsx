import { ChevronDown, LogOut, MessageSquare, Settings } from 'lucide-react';
import { Avatar } from '../../../assets';

const UserMenu = () => (
  <div className="dropdown dropdown-bottom dropdown-end">
    <button className="btn btn-ghost flex items-center gap-2">
      <div className="avatar">
        <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img src={Avatar} alt="Profile" />
        </div>
      </div>
      <span className="hidden sm:inline-block">Jane Doe</span>
      <ChevronDown className="hidden sm:inline-block w-4 h-4" />
    </button>
    <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
      <li>
        <a href="/messages">
          <MessageSquare className="w-4 h-4" /> Messages
        </a>
      </li>
      <li>
        <a href="/settings">
          <Settings className="w-4 h-4" /> Settings
        </a>
      </li>
      <li>
        <a href="/logout" className="text-error">
          <LogOut className="w-4 h-4" /> Logout
        </a>
      </li>
    </ul>
  </div>
);

export default UserMenu;
