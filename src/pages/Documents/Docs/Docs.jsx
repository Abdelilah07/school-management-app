import { useRef, useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import {
  ScrollText,
  Award,
  GraduationCap,
  AlertTriangle,
  FileBadge,
  FileType2,
  Scale,
  Users,
  User,
  Printer,
} from 'lucide-react';
import Convocation from './TemplatesDocs/Convocation';
import RetraitBacProvisoire from './TemplatesDocs/RetraitBacProvisoire';
import ReprimandNotice from './TemplatesDocs/ReprimandNotice';
import BacWithdrawalNotice from './TemplatesDocs/BacWithdrawalNotice';
import WarningNotice from './TemplatesDocs/WarningNotice';
import FormInput from './FormInput';

const DOCUMENT_TYPES = [
  {
    type: 'convocation',
    icon: ScrollText,
    label: 'Convocation',
    component: Convocation,
    theme: 'primary',
  },
  {
    type: 'retrait-bac',
    icon: Award,
    label: 'Retrait Bac Provisoire',
    component: RetraitBacProvisoire,
    theme: 'secondary',
  },
  {
    type: 'rebuke',
    icon: AlertTriangle,
    label: 'Reprimand Notice',
    components: { ReprimandNotice, WarningNotice },
    theme: 'warning',
  },
  {
    type: 'bac-withdrawal',
    icon: FileBadge,
    label: 'Bac Withdrawal Notice',
    component: BacWithdrawalNotice,
    theme: 'error',
  },
  {
    type: 'WarningNotice',
    icon: Scale,
    label: 'Warning Notice',
    component: WarningNotice,
    theme: 'info',
  },
];

const DocumentCard = ({ type, Icon, label, isSelected, onClick, theme }) => (
  <div
    className={`card bg-base-100 shadow-xl cursor-pointer transition-all hover:scale-105 
            ${isSelected ? `border-4 border-${theme} shadow-${theme}/50` : ''}`}
    onClick={() => onClick(type)}
  >
    <div className="card-body items-center text-center p-4">
      <Icon className={`w-8 h-8 ${isSelected ? `text-${theme}` : 'text-base-content'}`} />
      <h3 className="card-title text-sm mt-2">{label}</h3>
    </div>
  </div>
);

const Docs = () => {
  const [form, setForm] = useState({
    name: '',
    group: '',
    date: '',
    type: 'convocation',
    reason: [],
    resen1: '',
    resen2: '',
    resen3: '',
    cin: '',
    details: '',
  });
  const [selectedCard, setSelectedCard] = useState('convocation');
  const [isParGroupSelected, setIsParGroupSelected] = useState(false);
  const [selectedRebuke, setSelectedRebuke] = useState('ReprimandNotice');
  const [groupes, setGroupes] = useState([]);
  const printRef = useRef(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('http://localhost:3000/groups');
        const data = await response.json();
        setGroupes(data || []);
      } catch (error) {
        console.error('Failed to fetch groups:', error);
      }
    };
    fetchGroups();
  }, []);

  const validateForm = () => {
    if (!form.name && !form.group) {
      alert('Veuillez remplir au moins un champ');
      return false;
    }
    if (!form.date) {
      alert('Veuillez sélectionner une date');
      return false;
    }
    return true;
  };

  const createPrintableDocument = (student) => {
    const documentType = DOCUMENT_TYPES.find((doc) => doc.type === selectedCard);
    let DocumentComponent;

    if (selectedCard === 'rebuke') {
      DocumentComponent = documentType.components[selectedRebuke];
    } else {
      DocumentComponent = documentType?.component;
    }

    const container = document.createElement('div');
    container.style.pageBreakAfter = 'always';

    let documentProps = {
      key: student.idEtudiant,
      name: student.nomEtudiant,
      group: form.group,
      date: form.date,
      reason: form.reason,
      resen1: form.resen1,
      resen2: form.resen2,
      resen3: form.resen3,
    };

    // Add specific props for different document types
    if (selectedCard === 'bac-withdrawal') {
      documentProps.cin = student.cin;
      documentProps.student = student;
    }

    ReactDOM.render(<DocumentComponent {...documentProps} />, container);

    return container;
  };

  const onPrint = () => {
    if (!validateForm()) return;

    const originalDisplay = document.querySelector('.navbar')?.style.display;

    const printContainer = document.createElement('div');
    printContainer.style.position = 'absolute';
    printContainer.style.top = '0';
    printContainer.style.left = '0';
    printContainer.style.width = '100%';
    document.body.appendChild(printContainer);

    try {
      if (isParGroupSelected && form.group) {
        const selectedGroup = groupes.find((groupe) => groupe.niveau === form.group);
        if (!selectedGroup) return;

        const documents = selectedGroup.liste.map(createPrintableDocument);
        documents.forEach((doc) => printContainer.appendChild(doc));
      } else {
        let documentProps = {
          name: form.name,
          group: form.group,
          date: form.date,
          reason: form.reason,
          resen1: form.resen1,
          resen2: form.resen2,
          resen3: form.resen3,
        };

        // Add specific props for different document types
        if (selectedCard === 'bac-withdrawal') {
          documentProps.cin = form.cin;
        }

        let DocumentComponent;
        if (selectedCard === 'rebuke') {
          const documentType = DOCUMENT_TYPES.find((doc) => doc.type === selectedCard);
          DocumentComponent = documentType.components[selectedRebuke];
        } else {
          DocumentComponent = DOCUMENT_TYPES.find((doc) => doc.type === selectedCard)?.component;
        }

        ReactDOM.render(<DocumentComponent {...documentProps} />, printContainer);
      }

      const navbar = document.querySelector('.navbar');
      if (navbar) navbar.style.display = 'none';

      window.print();
    } catch (err) {
      console.error('Print error:', err);
      alert('An error occurred during printing');
    } finally {
      const navbar = document.querySelector('.navbar');
      if (navbar) navbar.style.display = originalDisplay;
      document.body.removeChild(printContainer);
    }
  };

  const renderDocumentForm = () => (
    <div className="form-control w-full gap-4">
      {!isParGroupSelected && (
        <FormInput
          label="Nom"
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="input input-bordered w-full"
        />
      )}

      <div className="form-control">
        <label className="label">
          <span className="label-text">Groupe</span>
        </label>
        <select
          className="select select-bordered w-full"
          value={form.group}
          onChange={(e) => setForm({ ...form, group: e.target.value })}
        >
          <option value="">Sélectionnez un groupe</option>
          {groupes.map(({ id, niveau }) => (
            <option key={id} value={niveau}>
              {niveau}
            </option>
          ))}
        </select>
      </div>

      <FormInput
        label="Date"
        type="date"
        name="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        className="input input-bordered w-full"
      />

      {selectedCard === 'rebuke' && (
        <div className="space-y-4">
          <div className="tabs tabs-boxed">
            <button
              className={`tab ${selectedRebuke === 'ReprimandNotice' ? 'tab-active' : ''}`}
              onClick={() => setSelectedRebuke('ReprimandNotice')}
            >
              Reprimand
            </button>
            <button
              className={`tab ${selectedRebuke === 'WarningNotice' ? 'tab-active' : ''}`}
              onClick={() => setSelectedRebuke('WarningNotice')}
            >
              Warning
            </button>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Reasons</span>
            </label>
            {[
              'Absence non justifiée',
              'Retard répété',
              'Comportement inapproprié',
              'Non-respect du règlement',
            ].map((reason) => (
              <label key={reason} className="label cursor-pointer">
                <span className="label-text">{reason}</span>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={form.reason.includes(reason)}
                  onChange={(e) => {
                    const newReasons = e.target.checked
                      ? [...form.reason, reason]
                      : form.reason.filter((r) => r !== reason);
                    setForm({ ...form, reason: newReasons });
                  }}
                />
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderDocument = useMemo(() => {
    const documentType = DOCUMENT_TYPES.find((doc) => doc.type === selectedCard);
    const DocumentComponent =
      selectedCard === 'rebuke'
        ? documentType?.components[selectedRebuke]
        : documentType?.component;

    return DocumentComponent ? <DocumentComponent {...form} /> : null;
  }, [form, selectedCard, selectedRebuke]);

  return (
    <div className="drawer lg:drawer-open">
      <input id="docs-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-200 lg:hidden">
          <div className="flex-none">
            <label htmlFor="docs-drawer" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Documents Generator</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1">
          {/* Document Preview */}
          <div className="flex-1 p-4 bg-base-200">
            <div className="card bg-base-100 shadow-xl h-full">
              <div className="card-body">{renderDocument}</div>
            </div>
          </div>

          {/* Document Types */}
          <div className="w-64 bg-base-100 p-4 border-l">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-center">Document Types</h2>
              <div className="grid gap-4">
                {DOCUMENT_TYPES.map(({ type, icon: Icon, label, theme }) => (
                  <DocumentCard
                    key={type}
                    type={type}
                    Icon={Icon}
                    label={label}
                    theme={theme}
                    isSelected={selectedCard === type}
                    onClick={setSelectedCard}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer */}
      <div className="drawer-side">
        <label htmlFor="docs-drawer" className="drawer-overlay"></label>
        <div className="p-4 w-80 bg-base-100 text-base-content h-full">
          <h2 className="text-xl font-bold mb-4">Document Settings</h2>

          <div className="join mb-4 w-full">
            <button
              className={`join-item btn ${!isParGroupSelected ? 'btn-active' : ''}`}
              onClick={() => setIsParGroupSelected(false)}
            >
              <User className="w-4 h-4 mr-2" />
              Individual
            </button>
            <button
              className={`join-item btn ${isParGroupSelected ? 'btn-active' : ''}`}
              onClick={() => setIsParGroupSelected(true)}
            >
              <Users className="w-4 h-4 mr-2" />
              Group
            </button>
          </div>

          {renderDocumentForm()}

          <button className="btn btn-primary w-full mt-4" onClick={onPrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default Docs;
