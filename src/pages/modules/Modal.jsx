import PropTypes from 'prop-types';


function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
        <div className="p-6">{children}</div>
        <div className="p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen : PropTypes.bool.isRequired,
  onClose : PropTypes.func.isRequired,
  children : PropTypes.node
}

export default Modal;