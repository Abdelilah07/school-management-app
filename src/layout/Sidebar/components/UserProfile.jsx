import { getUserFromStorage } from "../../../utils";

const UserProfile = () => {

  const user = getUserFromStorage('user');

  return (
    <div className="flex items-center gap-3 px-2">
      <div className="profile-photo">
        <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img
            src={user?.profilePicture || ''}
            alt={`${user?.name || 'Guest'}'s profile`}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{user?.name || 'Guest'}</p>
        <p className="text-sm text-base-content/60 truncate">{user?.role || 'User'}</p>
      </div>
    </div>
  );
};

export default UserProfile;