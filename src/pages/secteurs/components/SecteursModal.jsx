import { Modal } from '../../../components';
import ViewSecteur from './ViewSecteur';
import AddEditSecteur from './AddEditSecteur';

const SecteursModal = ({ isOpen, mode, secteur, onClose, onSave, onDelete }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {mode === 'view' ? (
        <ViewSecteur secteur={secteur} onClose={onClose} onDelete={onDelete} />
      ) : (
        <AddEditSecteur
          secteur={secteur}
          onClose={onClose}
          onSave={onSave}
          isEditMode={mode === 'edit'}
        />
      )}
    </Modal>
  );
};

export default SecteursModal;
