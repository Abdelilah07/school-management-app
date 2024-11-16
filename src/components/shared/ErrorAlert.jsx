import { AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';

const ErrorAlert = ({ message }) => (
  <div className="alert alert-error m-6">
    <AlertCircle className="h-6 w-6" />
    <span>{message}</span>
  </div>
);

ErrorAlert.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ErrorAlert;
