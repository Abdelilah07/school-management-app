import Modal from '../../../components/shared/Modal';
import ViewFiliere from './ViewFiliere';
import AddEditFiliere from './AddEditFiliere';
import PropTypes from 'prop-types';

const FilieresModal = ({ isOpen, mode, filiere, onClose, onSave, onDelete }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {mode === 'view' ? (
        <ViewFiliere filiere={filiere} onClose={onClose} onDelete={onDelete} />
      ) : (
        <AddEditFiliere
          filiere={filiere}
          onClose={onClose}
          onSave={onSave}
          isEditMode={Boolean(filiere)}
        />
      )}
    </Modal>
  );
};

FilieresModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['add', 'edit', 'view']).isRequired,
  filiere: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default FilieresModal;
