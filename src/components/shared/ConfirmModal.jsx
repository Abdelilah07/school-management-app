// src/components/shared/ConfirmationModal.jsx
import { AlertTriangle } from 'lucide-react';
import PropTypes from 'prop-types';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmation',
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  variant = 'danger', // or "warning", "info"
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: 'btn-error',
    warning: 'btn-warning',
    info: 'btn-info',
  };

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <AlertTriangle
            className={`w-5 h-5 ${variant === 'danger' ? 'text-error' : 'text-warning'}`}
          />
          {title}
        </h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            {cancelLabel}
          </button>
          <button
            className={`btn btn-sm ${variantStyles[variant]}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-base-200/80" onClick={onClose} />
    </dialog>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  variant: PropTypes.oneOf(['danger', 'warning', 'info']),
};

export default ConfirmationModal;
