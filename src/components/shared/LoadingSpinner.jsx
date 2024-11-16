import PropTypes from 'prop-types';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="flex flex-col items-center gap-4">
      <span className="loading loading-spinner loading-lg text-primary"></span>
      <p className="text-lg text-base-content/70">{message}</p>
    </div>
  </div>
);

LoadingSpinner.propTypes = {
  message: PropTypes.string,
};

export default LoadingSpinner;
