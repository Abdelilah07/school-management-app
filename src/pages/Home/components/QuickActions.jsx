import Tile from './Tile';
import { MessageCircleQuestion, Search, X, User, UserPlus, Users } from 'lucide-react';

const QuickActions = () => {
  const tiles = [
    { title: 'Random quiz', Icon: MessageCircleQuestion },
    { title: 'Tile 2', Icon: Users },
    { title: 'Tile 3', Icon: UserPlus },
    { title: 'Tile 4', Icon: Search },
    { title: 'Tile 5', Icon: User },
    { title: 'Tile 6', Icon: X },
  ];

  return (
    <div className="flex flex-col gap-y-4 w-full border border-base-200 rounded-lg p-4">
      <h3 className="text-3xl font-semibold">Quick Actions</h3>
      <div className="flex flex-wrap flex-col md:flex-row gap-2">
        {tiles.map((tile) => (
          <Tile key={tile.title} tile={tile} />
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
