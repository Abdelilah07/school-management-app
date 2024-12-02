import PropTypes from 'prop-types';
import { useState } from 'react';

const Tile = ({ tile, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      className="perspective-500 w-full h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`
          relative 
          w-full 
          h-full 
          min-h-[180px] 
          transform 
          transition-transform 
          duration-300 
          ${isHovered ? 'rotate-y-6' : ''}
          preserve-3d
        `}
      >
        {/* Front of the card */}
        <div
          className={`
            absolute 
            inset-0 
            bg-base-100 
            rounded-2xl 
            shadow-md 
            border 
            border-base-200 
            flex 
            flex-col 
            items-center 
            justify-center 
            text-center 
            p-4 
            backface-hidden 
            ${isHovered ? 'opacity-0' : 'opacity-100'}
            transition-opacity 
            duration-300
          `}
        >
          <div
            className={`
              p-3 
              rounded-full 
              mb-3 
              transition-colors 
              duration-300 
              ${isHovered ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content'}
            `}
          >
            <tile.Icon className="w-10 h-10 transition-transform duration-300" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-semibold">{tile.title}</h3>
        </div>

        {/* Back of the card */}
        <div
          className={`
            absolute 
            inset-0 
            bg-base-200 
            rounded-2xl 
            shadow-md 
            border 
            border-base-300 
            flex 
            flex-col 
            items-center 
            justify-center 
            text-center 
            p-4 
            rotate-y-180 
            backface-hidden 
            ${isHovered ? 'opacity-100' : 'opacity-0'}
            transition-opacity 
            duration-300
          `}
        >
          <p className="text-base-content mb-4 line-clamp-3">{tile.description}</p>
          <button
            className="btn btn-primary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Take Action
          </button>
        </div>
      </div>
    </div>
  );
};

Tile.propTypes = {
  tile: PropTypes.shape({
    title: PropTypes.string.isRequired,
    Icon: PropTypes.elementType.isRequired,
    description: PropTypes.string,
    category: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
};

Tile.defaultProps = {
  onClick: () => {},
};

export default Tile;
