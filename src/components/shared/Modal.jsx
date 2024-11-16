import { X } from 'lucide-react';
import PropTypes from 'prop-types';

const Modal = ({ isOpen, onClose, children, maxWidth = 'max-w-2xl' }) => {
  if (!isOpen) return null;

  return (
    <dialog open className="modal modal-open">
      <div className={`modal-box ${maxWidth}`}>
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>
      <div className="modal-backdrop bg-base-200/80" onClick={onClose} />
    </dialog>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
  maxWidth: PropTypes.string,
};

export default Modal;
