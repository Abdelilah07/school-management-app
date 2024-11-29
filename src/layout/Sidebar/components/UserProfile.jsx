import PropTypes from 'prop-types';

const UserProfile = ({ name, role, profile_picture }) => {
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="profile-photo">
        <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img
            src={profile_picture}
            alt={`${name}'s profile`}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{name}</p>
        <p className="text-sm text-base-content/60 truncate">{role}</p>
      </div>
    </div>
  );
};

UserProfile.propTypes = {
  name: PropTypes.string,
  role: PropTypes.string,
  profile_picture: PropTypes.string,
};

export default UserProfile;
