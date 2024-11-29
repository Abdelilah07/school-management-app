import Modal from '../../../components/shared/Modal';

import PropTypes, { number } from 'prop-types';
import ViewGroupes from './ViewGroupes';
import AddEditGroupe from './AddEditGroupe';

const GroupesModal = ({ isOpen, groupCount, mode, group, onClose, onSave, onDelete }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {mode === 'view' ? (
        <ViewGroupes group={group} onClose={onClose} onDelete={onDelete} />
      ) : (
        <AddEditGroupe
          group={group}
          onClose={onClose}
          onSave={onSave}
          isEditMode={Boolean(group)}
          groupCount={groupCount}
        />
      )}
    </Modal>
  );
};

GroupesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['add', 'edit', 'view']).isRequired,
  group: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  groupCount: PropTypes.number.isRequired,
};

export default GroupesModal;
