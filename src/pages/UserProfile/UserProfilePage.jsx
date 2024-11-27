import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Camera, Mail, Phone, Globe, MapPin, Building, 
  Check, X, Calendar, Trash2, User, Edit3 
} from 'lucide-react';
import avatar from '../../assets/avatar.png';
import defaultImage from '../../assets/default.png';
import {
  fetchUserProfile,
  updateUserProfile,
  updateUserField,
} from '../../features/userProfile/profileSlice';

const UserProfilePage = () => {
  const dispatch = useDispatch();
  const { user, isLoading} = useSelector((state) => state.profile);
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [imageHovered, setImageHovered] = useState(false);
  const [editableUser, setEditableUser] = useState(null);

  useEffect(() => {
    const storedUserId = JSON.parse(
      localStorage.getItem('user') || sessionStorage.getItem('user')
    )?.id;
    if (storedUserId) {
      dispatch(fetchUserProfile(storedUserId));
    }
  }, [dispatch]);

  useEffect(() => {
    if (user && !user.joinedDate) {
      dispatch(updateUserField({ joinedDate: new Date().toISOString() }));
      setIsDirty(true);
    }
  }, [user, dispatch]);

  const formattedJoinedDate = user?.joinedDate 
  ? new Date(user.joinedDate).toLocaleDateString()
  : new Date().toLocaleDateString();


 const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditableUser({ ...editableUser, photo: reader.result });
        setIsDirty(true);
        showNotification('Photo uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePhoto = () => {
    setEditableUser({ ...editableUser, photo: defaultImage });
    setIsDirty(true);
    showNotification('Photo removed successfully');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableUser({ ...editableUser, [name]: value });
    setIsDirty(true);
  };
  const handleCancel = () => {
    setIsEditing(false);
    setIsDirty(false);
    setEditableUser(null); // Discard local changes
  };

  const handleEdit = () => {
    setEditableUser({ ...user }); // Copy current user data to editable state
    setIsEditing(true);
    setIsDirty(false);
  };

  const handleSave = async () => {
    try {
      await dispatch(updateUserProfile(editableUser)).unwrap();
      setIsEditing(false);
      setIsDirty(false);
      showNotification('Profile updated successfully');
    } catch (error) {
      showNotification('Error saving profile', 'error');
    }
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content/60 animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen bg-base-200 transition-all duration-300 ">
    {/* Hero Banner */}
    <div className="relative bg-primary h-72 overflow-hidden rounded-t-md">
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-secondary rounded-t-md opacity-100"></div>
    </div>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 pb-12 relative z-10">
      {/* Main Card */}
      <div className="card bg-base-100 shadow-2xl backdrop-blur-sm">
        <div className="card-body p-0">
          {/* Profile Header */}
          <div className="p-8 pb-6">
            <div className="flex flex-col sm:flex-row gap-8">
              {/* Avatar Section */}
              <div className="relative mx-auto sm:mx-0 group">
                <div className="avatar" 
                     onMouseEnter={() => setImageHovered(true)}
                     onMouseLeave={() => setImageHovered(false)}>
                  <div className={`w-36 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4 shadow-xl transition-all duration-300 ${imageHovered ? 'ring-secondary' : ''}`}>
                    <div className="relative">
                      <img
                        src={user?.photo || avatar}
                        alt="Profile"
                        className={`object-cover transition-all duration-300 ${isLoading ? 'opacity-50' : ''} ${imageHovered ? 'scale-105' : ''}`}
                      />
                      {isEditing && imageHovered && (
                        <div className="absolute inset-0 bg-base-content/30 backdrop-blur-sm flex items-center justify-center rounded-full transition-all duration-300">
                          <label className="btn btn-circle btn-ghost btn-lg glass hover:bg-primary/50 cursor-pointer">
                            <Camera className="w-6 h-6 text-base-100" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handlePhotoUpload}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {isEditing && (
                  <div className="absolute -bottom-2 right-0 flex gap-2 scale-90 opacity-90 hover:scale-100 hover:opacity-100 transition-all duration-200">
                    <label className="btn btn-circle btn-primary btn-sm hover:btn-secondary tooltip tooltip-top" data-tip="Upload photo">
                      <Camera className="w-4 m-auto mt-1" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                    {user?.photo && user.photo !== defaultImage && (
                      <button
                        className="btn btn-circle btn-error btn-sm hover:btn-secondary tooltip tooltip-top"
                        data-tip="Remove photo"
                        onClick={handleDeletePhoto}
                      >
                        <Trash2 className="w-4 m-auto " />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center sm:text-left space-y-4">
                <div className="space-y-3">
                  {isEditing ? (
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={editableUser?.name || ''}
                        onChange={handleChange}
                        className="input input-bordered input-primary w-full max-w-xs text-2xl font-bold pe-10"
                        placeholder="Your name"
                      />
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/60" />
                    </div>
                  ) : (
                    <h2 className="text-2xl font-bold text-base-content tracking-tight">{user?.name}</h2>
                  )}
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <div className="badge badge-primary gap-2 p-3 badge-lg">
                      <Building className="w-4 h-4" />
                      {user?.role || 'Member'}
                    </div>
                    <div className="badge badge-ghost gap-2 p-3 badge-lg">
                      <Calendar className="w-4 h-4" />
                          Joined {formattedJoinedDate}
                    </div>
                  </div>
                </div>
              </div>

                 {/* Action Buttons */}
                 <div className="flex justify-center sm:justify-end gap-2">
                  {isEditing ? (
                    <div className="join">
                      <button
                        className="btn btn-ghost join-item gap-2 hover:btn-error"
                        onClick={handleCancel}
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary join-item gap-2 hover:btn-secondary"
                        onClick={handleSave}
                        disabled={!isDirty || isLoading}
                      >
                        <Check className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="btn btn-primary gap-2 hover:btn-secondary transition-all duration-200" 
                      onClick={handleEdit}
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="divider my-0"></div>

            {/* Profile Details */}
            <div className="p-8">
              <div className="grid gap-6 md:grid-cols-2">
                {[
                  { icon: Mail, label: 'Email', value: isEditing ? editableUser?.email : user?.email, name: 'email', type: 'email' },
                  { icon: Phone, label: 'Phone', value: isEditing ? editableUser?.phoneNumber : user?.phoneNumber, name: 'phoneNumber', type: 'tel' },
                  { icon: MapPin, label: 'Location', value: isEditing ? editableUser?.address?.city : user?.address?.city, name: 'address' },
                  { icon: Globe, label: 'Website', value: isEditing ? editableUser?.website : user?.website, name: 'website', type: 'url' },
                ].map(({ icon: Icon, label, value, name, type }) => (
                  <div key={name} className="form-control group">
                    <label className="label">
                      <span className="label-text font-medium text-base-content/80 group-hover:text-primary transition-colors duration-200">
                        {label}
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors duration-200" />
                      </div>
                      {isEditing ? (
                        <input
                          type={type || 'text'}
                          name={name}
                          value={value || ''}
                          onChange={handleChange}
                          className="input input-bordered w-full pl-10 focus:input-primary transition-all duration-200 hover:border-primary"
                          placeholder={`Enter your ${label.toLowerCase()}`}
                        />
                      ) : (
                        <div className="input input-bordered w-full pl-10 bg-base-200/50 text-base-content/80 flex items-center group-hover:text-primary group-hover:bg-base-200 transition-all duration-200">
                          {value ? <span className="">{value}</span> : <span className="text-base-content/40">Not specified</span>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="divider"></div>

              {/* Biography Section */}
              <div className="form-control w-full group">
                <label className="label">
                  <span className="label-text font-medium text-base-content/80 group-hover:text-primary transition-colors duration-200">
                    Biography
                  </span>
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={editableUser?.bio || ''}
                    onChange={handleChange}
                    className="textarea textarea-bordered focus:textarea-primary min-h-32 transition-all duration-200 hover:border-primary"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                ) : (
                  <div className="textarea textarea-bordered bg-base-200/50 min-h-32 group-hover:text-primary text-base-content/80 group-hover:bg-base-200 transition-all duration-200">
                    {user?.bio || <span className="text-base-content/40">No bio available</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;

