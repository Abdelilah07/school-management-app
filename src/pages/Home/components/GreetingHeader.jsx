import { getUserFromStorage } from '../../../utils';
import { User, Award, ChartLine, Crown } from 'lucide-react';

const getGreetingDetails = (user) => {
  const hour = new Date().getHours();
  const name = user?.name || 'User';

  const timeOfDay = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';

  switch (user?.role) {
    case 'super user':
      return {
        icon: <Crown className="w-10 h-10 text-yellow-400" />,
        title: `Good ${timeOfDay}, ${name}`,
        subtitle: 'Full system access and top-level management capabilities',
      };
    case 'admin':
      return {
        icon: <ChartLine className="w-10 h-10 text-white" />,
        title: `Good ${timeOfDay}, ${name}`,
        subtitle: "Manage and oversee your organization's training platform",
      };
    case 'trainer':
      return {
        icon: <Award className="w-10 h-10 text-white" />,
        title: `Good ${timeOfDay}, ${name}`,
        subtitle: 'Prepare to guide and inspire your learners today',
      };
    case 'trainee':
      return {
        icon: <User className="w-10 h-10 text-white" />,
        title: `Good ${timeOfDay}, ${name}`,
        subtitle: 'Ready to learn and grow your skills?',
      };
    default:
      return {
        icon: <User className="w-10 h-10 text-white" />,
        title: `Good ${timeOfDay}, ${name}`,
        subtitle: 'Welcome to the training platform',
      };
  }
};

const GreetingHeader = () => {
  const user = getUserFromStorage('user');
  const { icon, title, subtitle } = getGreetingDetails(user);

  return (
    <div className="card w-full bg-base-100 p-2 border border-base-200">
      <div className="card-body flex flex-row items-center space-x-6">
        <div className="Profile picture placeholder">
          <div className="bg-neutral-focus text-neutral-content rounded-full w-24 h-24 flex items-center justify-center">
            {user?.profile_picture ? (
              <img
                src={user.profile_picture}
                alt={`${user.name}'s profile picture`}
                className="rounded-full"
              />
            ) : (
              icon
            )}
          </div>
        </div>
        <div>
          <h1 className="card-title text-3xl font-bold text-primary mb-2">{title}</h1>
          <p className="text-base text-base-content opacity-70">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default GreetingHeader;
