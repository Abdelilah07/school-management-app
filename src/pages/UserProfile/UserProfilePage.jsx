import { useState, useEffect } from 'react';
import { updateMyProfile, getMyProfile } from '../../services/profileService';
import { updateUserInStorage } from '../../utils';
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Building,
  Check,
  X,
  Calendar,
  Trash2,
  User,
  Edit3,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [imageHovered, setImageHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Backend URL for image display (assuming public storage)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:80';

  // imageUrl directly uses profile_picture from editableUser, construct full URL
  const imageUrl = editableUser?.profile_picture
    ? `${BACKEND_URL}/storage/${editableUser.profile_picture}`
    : '/path/to/default/avatar.png'; // Provide a default image path

  // --- Fetch User Profile on Component Mount ---
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedUser = await getMyProfile(); // Get the authenticated user's profile
        setUser(fetchedUser); // Set the main user state
        setEditableUser({ // Initialize editableUser with fetched data
          id: fetchedUser.id,
          name: fetchedUser.name || '',
          email: fetchedUser.email || '',
          phone: fetchedUser.phone || '',
          address: fetchedUser.address || '',
          birthdate: fetchedUser.birthdate || '',
          gender: fetchedUser.gender || '',
          profile_picture: fetchedUser.profile_picture || null,
          is_active: fetchedUser.is_active,
          last_login_at: fetchedUser.last_login_at,
          created_at: fetchedUser.created_at,
          updated_at: fetchedUser.updated_at,
        });
        updateUserInStorage(fetchedUser); // Keep local storage in sync
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError('Failed to load profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // --- Handle Photo Upload (now directly updates editableUser with the File object) ---
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditableUser((prev) => ({ ...prev, profile_picture: file })); // Store the File object
      setIsDirty(true);
      // Optional: Set a temporary URL for immediate preview (e.g., URL.createObjectURL(file))
      // setImageUrl(URL.createObjectURL(file)); // If you want a preview before saving
    }
  };

  const handleDeletePhoto = () => {
    setEditableUser((prev) => ({ ...prev, profile_picture: null }));
    setIsDirty(true);
    console.log('Photo removed successfully');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableUser((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsDirty(false);
    if (user) {
      setEditableUser({
        id: user.id,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        birthdate: user.birthdate || '',
        gender: user.gender || '',
        profile_picture: user.profile_picture || null, // Revert to backend's picture path
        is_active: user.is_active,
        last_login_at: user.last_login_at,
        created_at: user.created_at,
        updated_at: user.updated_at,
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsDirty(false);
  };

  // --- handleSave now sends FormData if a file is present ---
  const handleSave = async () => {
    if (!editableUser) return;
    try {
      const formData = new FormData();

      // Append existing text fields
      formData.append('name', editableUser.name || '');
      formData.append('email', editableUser.email || '');
      formData.append('phone', editableUser.phone || '');
      formData.append('address', editableUser.address || '');
      formData.append('birthdate', editableUser.birthdate || '');
      formData.append('gender', editableUser.gender || '');

      // Handle profile_picture:
      if (editableUser.profile_picture instanceof File) {
        // A new file was selected
        formData.append('profile_picture', editableUser.profile_picture);
      } else if (editableUser.profile_picture === null) {
        // Photo was deleted/removed (explicitly send null or empty string to backend)
        formData.append('profile_picture', ''); // Or 'null' depending on your Laravel validation/handling
      } else {
        // No new file, existing path (string) - append it back to ensure it's not lost
        formData.append('profile_picture', editableUser.profile_picture);
      }

      // For PUT/PATCH requests with FormData, you usually need to spoof the method in Laravel
      formData.append('_method', 'PUT'); // Or 'PATCH'

      const updatedUserResponse = await updateMyProfile(formData); // Send FormData

      if (updatedUserResponse) {
        setUser(updatedUserResponse);
        setEditableUser({
          id: updatedUserResponse.id,
          name: updatedUserResponse.name || '',
          email: updatedUserResponse.email || '',
          phone: updatedUserResponse.phone || '',
          address: updatedUserResponse.address || '',
          birthdate: updatedUserResponse.birthdate || '',
          gender: updatedUserResponse.gender || '',
          profile_picture: updatedUserResponse.profile_picture || null,
          is_active: updatedUserResponse.is_active,
          last_login_at: updatedUserResponse.last_login_at,
          created_at: updatedUserResponse.created_at,
          updated_at: updatedUserResponse.updated_at,
        });

        updateUserInStorage(updatedUserResponse);
        setIsEditing(false);
        setIsDirty(false);
        setError(null);
        console.log('Profile updated successfully', updatedUserResponse);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center text-error-content rounded-box p-6 shadow-lg m-4">
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  if (!user || !editableUser) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center text-warning-content rounded-box p-6 shadow-lg m-4">
        <p className="text-lg">No profile data available. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 transition-all duration-300 ">
      {/* Hero Banner */}
      <div className="relative bg-primary h-72 overflow-hidden rounded-t-md">
        <div className="absolute inset-0 bg-linear-to-r from-primary via-primary to-secondary rounded-t-md opacity-100"></div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 pb-12 relative z-10">
        {/* Main Card */}
        <div className="card bg-base-100 shadow-2xl backdrop-blur-xs">
          <div className="card-body p-0">
            {/* Profile Header */}
            <div className="p-8 pb-6">
              <div className="flex flex-col sm:flex-row gap-8">
                {/* Avatar Section */}
                <div className="relative mx-auto sm:mx-0 group">
                  <div
                    className="avatar"
                    onMouseEnter={() => setImageHovered(true)}
                    onMouseLeave={() => setImageHovered(false)}
                  >
                    <div
                      className={`w-36 rounded-full ring-3 ring-primary ring-offset-base-100 ring-offset-4 shadow-xl transition-all duration-300 ${imageHovered ? 'ring-secondary' : ''}`}
                    >
                      <div className="relative">
                        <img
                          src={imageUrl}
                          alt="Profile"
                          className={`object-cover transition-all duration-300 ${imageHovered ? 'scale-105' : ''}`}
                        />
                        {isEditing && imageHovered && (
                          <div className="absolute inset-0 bg-base-content/30 backdrop-blur-xs flex items-center justify-center rounded-full transition-all duration-300">
                            <label className="btn btn-circle btn-ghost btn-lg glass hover:bg-primary/50 cursor-pointer">
                              <Camera className="w-6 h-6 text-base-100" />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePhotoUpload} // Now just sets the file to state
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {isEditing && (
                    <div className="absolute -bottom-2 right-0 flex gap-2 scale-90 opacity-90 hover:scale-100 hover:opacity-100 transition-all ">
                      {editableUser?.profile_picture && (
                        <button
                          className="btn btn-circle btn-error btn-sm hover:btn-secondary tooltip tooltip-top"
                          data-tip="Remove profile picture"
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
                      <h2 className="text-2xl font-bold text-base-content tracking-tight">
                        {user?.name}
                      </h2>
                    )}
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <div className="badge badge-primary gap-2 p-3 badge-lg">
                        <Building className="w-4 h-4" />
                        {user?.roles[0] || 'Member'}
                      </div>
                      <div className="badge badge-ghost gap-2 p-3 badge-lg">
                        <Calendar className="w-4 h-4" />
                        Joined{' '}
                        {user.created_at ? format(new Date(user.created_at), 'MMM dd, yyyy') : 'N/A'}
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
                        disabled={!isDirty}
                      >
                        <Check className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary gap-2 hover:btn-secondary transition-all "
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
                  {
                    icon: Mail,
                    label: 'Email',
                    value: isEditing ? editableUser?.email : user?.email,
                    name: 'email',
                    type: 'email',
                  },
                  {
                    icon: Phone,
                    label: 'Phone',
                    value: isEditing ? editableUser?.phone : user?.phone,
                    name: 'phone',
                    type: 'tel',
                  },
                  {
                    icon: MapPin,
                    label: 'Address',
                    value: isEditing ? editableUser?.address : user?.address,
                    name: 'address',
                    type: 'text',
                  },
                  {
                    icon: Calendar,
                    label: 'Birthdate',
                    value: isEditing
                      ? editableUser?.birthdate
                      : (user?.birthdate ? format(new Date(user.birthdate), 'yyyy-MM-dd') : ''),
                    name: 'birthdate',
                    type: 'date',
                  },
                  {
                    icon: User,
                    label: 'Gender',
                    value: isEditing ? editableUser?.gender : user?.gender,
                    name: 'gender',
                    type: 'text',
                  },
                ].map(({ icon: Icon, label, value, name, type }) => (
                  <div key={name} className='flex flex-col space-y-2'>
                    <label className="label">{label}</label>
                    <label className="input validator">
                      <Icon className={cn(
                        'w-5 h-5',
                        isEditing ? 'text-primary' : 'text-primary/60'
                      )} />
                      {isEditing ? (
                        type === 'date' ? (
                          <input
                            type="date"
                            name={name}
                            value={value || ''}
                            onChange={handleChange}
                            className="grow"
                          />
                        ) : (
                          <input
                            type={type || 'text'}
                            name={name}
                            value={value || ''}
                            onChange={handleChange}
                            className="grow"
                            placeholder={`Enter your ${label.toLowerCase()}`}
                          />
                        )
                      ) : (
                        <input
                          type="text"
                          disabled
                          value={type === 'date' && value ? format(new Date(value), 'MMM dd, yyyy') : value || ''}
                          className="grow"
                        />
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;