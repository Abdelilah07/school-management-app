import PropTypes from 'prop-types';

const Tile = ({ tile }) => {
  return (
    <button className="btn btn-outline rounded-lg flex gap-2 p-4 cursor-pointer select-none items-center justify-center transition duration-150 ease-in-out w-full h-24 md:w-64 lg:w-80 xl:w-96">
      <tile.Icon className="w-10 h-10" strokeWidth={1} />
      <span className="text-lg font-semibold">{tile.title}</span>
    </button>
  );
};

Tile.propTypes = {
  tile: PropTypes.object.isRequired,
};

export default Tile;
