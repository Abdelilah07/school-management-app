import { useState } from 'react';
import Tile from './Tile';
import {
  MessageCircleQuestion,
  Search,
  Users,
  UserPlus,
  BookOpen,
  TrendingUp,
  HelpCircle,
  FilePlus,
  Zap,
} from 'lucide-react';
import { getUserFromStorage } from '../../../utils';

const QuickActions = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const user = getUserFromStorage('user');

  // Dynamically generate tiles based on user role
  const getTiles = (role) => {
    const roleTiles = {
      'super user': [
        {
          category: 'management',
          title: 'Manage Users',
          Icon: Users,
          description: 'Add, edit, or remove platform users',
        },
        {
          category: 'analytics',
          title: 'System Analytics',
          Icon: TrendingUp,
          description: 'View comprehensive platform metrics',
        },
        {
          category: 'content',
          title: 'Create Content',
          Icon: FilePlus,
          description: 'Develop new training materials',
        },
        {
          category: 'learning',
          title: 'Random Quiz',
          Icon: MessageCircleQuestion,
          description: 'Generate a random knowledge check',
        },
      ],
      admin: [
        {
          category: 'management',
          title: 'User Management',
          Icon: UserPlus,
          description: 'Manage team members and roles',
        },
        {
          category: 'learning',
          title: 'Course Library',
          Icon: BookOpen,
          description: 'Browse and manage training courses',
        },
        {
          category: 'tools',
          title: 'Search',
          Icon: Search,
          description: 'Find users, courses, or resources',
        },
        {
          category: 'learning',
          title: 'Random Quiz',
          Icon: MessageCircleQuestion,
          description: 'Generate a quick assessment',
        },
      ],
      trainer: [
        {
          category: 'content',
          title: 'Create Course',
          Icon: FilePlus,
          description: 'Design a new training module',
        },
        {
          category: 'analytics',
          title: 'Track Progress',
          Icon: TrendingUp,
          description: 'View learner performance',
        },
        {
          category: 'learning',
          title: 'Random Quiz',
          Icon: MessageCircleQuestion,
          description: 'Generate a knowledge check',
        },
        {
          category: 'support',
          title: 'Help Center',
          Icon: HelpCircle,
          description: 'Access trainer resources',
        },
      ],
      trainee: [
        {
          category: 'learning',
          title: 'My Courses',
          Icon: BookOpen,
          description: 'Continue your learning path',
        },
        {
          category: 'learning',
          title: 'Random Quiz',
          Icon: MessageCircleQuestion,
          description: 'Test your knowledge',
        },
        {
          category: 'tools',
          title: 'Search Courses',
          Icon: Search,
          description: 'Find new learning opportunities',
        },
        {
          category: 'support',
          title: 'Help Center',
          Icon: HelpCircle,
          description: 'Get support and guidance',
        },
      ],
      default: [
        {
          category: 'learning',
          title: 'Random Quiz',
          Icon: MessageCircleQuestion,
          description: 'Generate a quick challenge',
        },
        {
          category: 'tools',
          title: 'Search',
          Icon: Search,
          description: 'Find resources',
        },
        {
          category: 'support',
          title: 'Help Center',
          Icon: HelpCircle,
          description: 'Get assistance',
        },
      ],
    };

    return roleTiles[role] || roleTiles['default'];
  };

  const tiles = getTiles(user?.role);

  return (
    <div className="flex flex-col gap-y-4 p-4 bg-base-100 rounded-2xl overflow-hidden w-full border border-base-200">
      {/* Category Navigation */}
      <h3 className="text-2xl font-bold text-primary">Quick Actions</h3>

      {/* Tiles Grid */}
      <div className="">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tiles.map((tile) => (
            <Tile
              key={tile.title}
              tile={tile}
              onClick={() => {
                // Add any specific action logic here
                console.log(`Clicked ${tile.title}`);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
