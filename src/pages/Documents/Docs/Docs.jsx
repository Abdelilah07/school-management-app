import React, { useRef, useState, useEffect } from 'react';
import Convocation from './TemplatesDocs/Convocation';
import DocumentCard from './DocumentCard';
import FormInput from './FormInput';
import SelectionToggle from './SelectionToggle';
import PrintWrapper from './PrintWrapper';
import ReactDOM from 'react-dom'; // Add this import at the top of your file
import { FileText, GraduationCap, ClipboardList, User, Users } from 'lucide-react';

const Docs = () => {
  const [form, setForm] = useState({
    name: '',
    group: '',
    date: '',
    type: 'convocation',
  });

  const [selectedCard, setSelectedCard] = useState('convocation');
  const [isParGroupSelected, setIsParGroupSelected] = useState(false);
  const [groupes, setGroupes] = useState([]);
  const [students, setStudents] = useState([]); // Store students' data here
  const printRef = useRef(null);

  // Fetch the groups and students when the component mounts
  useEffect(() => {
    const fetchGroupesAndStudents = async () => {
      try {
        const response = await fetch('http://localhost:3000/groups'); // Update with your actual API URL
        const data = await response.json();
        setGroupes(data);

        // Extract students' names from the fetched groups
        const allStudents = data.flatMap((group) => group.liste);
        setStudents(allStudents);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGroupesAndStudents();
  }, []);

  const onPrint = () => {
    const originalDisplay = document.querySelector('.navbar')?.style.display;
    const printContainer = document.createElement('div');
    printContainer.style.position = 'absolute';
    printContainer.style.top = '0';
    printContainer.style.left = '0';
    printContainer.style.width = '100%';
    document.body.appendChild(printContainer);

    if (isParGroupSelected && form.group) {
      const selectedGroup = groupes.find((groupe) => groupe.niveau === form.group);
      if (!selectedGroup) return;

      const convocations = selectedGroup.liste.map((student) => {
        const container = document.createElement('div');
        container.style.pageBreakAfter = 'always';
        ReactDOM.render(
          <Convocation
            key={student.idEtudiant}
            name={student.nomEtudiant}
            group={form.group}
            date={form.date}
          />,
          container
        );
        return container;
      });

      convocations.forEach((convocation) => {
        printContainer.appendChild(convocation);
      });
    } else {
      ReactDOM.render(
        <Convocation name={form.name} group={form.group} date={form.date} />,
        printContainer
      );
    }

    // Hide the navbar before printing
    const navbar = document.querySelector('.navbar');
    if (navbar) navbar.style.display = 'none';

    window.print();

    // Restore the navbar display after printing
    if (navbar) navbar.style.display = originalDisplay;

    document.body.removeChild(printContainer);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleCardClick = (type) => {
    setSelectedCard(type);
    setForm((prevForm) => ({ ...prevForm, type }));
  };

  const documentTypes = [
    { type: 'convocation', icon: FileText, label: 'Convocation' },
    { type: 'diplome', icon: GraduationCap, label: 'Diplome' },
    { type: 'listes', icon: ClipboardList, label: 'Listes' },
  ];

  const renderDocument = () => {
    switch (form.type) {
      case 'convocation':
        return <Convocation {...form} />;
      case 'diplome':
        return <div>Diplome</div>;
      case 'listes':
        return <div>Listes</div>;
      default:
        return null;
    }
  };

  const renderForm = () => {
    if (isParGroupSelected) {
      return (
        <div className="space-y-4">
          <select
            name="group"
            value={form.group}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="">Sélectionnez un groupe</option>
            {groupes.map(({ id, niveau }) => (
              <option key={id} value={niveau}>
                {niveau}
              </option>
            ))}
          </select>

          <FormInput
            label="Date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <FormInput
          label="Nom"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nom"
        />

        <FormInput
          label="Group & Filiere"
          name="group"
          value={form.group}
          onChange={handleChange}
          placeholder="Group"
        />
        <FormInput label="Date" type="date" name="date" value={form.date} onChange={handleChange} />
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 border-r border-gray-200 p-8 overflow-y-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Documents
          </h1>
          <p className="">Cette page vous permet de générer des documents.</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {documentTypes.map(({ type, icon, label }) => (
            <DocumentCard
              key={type}
              type={type}
              Icon={icon}
              label={label}
              isSelected={selectedCard === type}
              onClick={handleCardClick}
            />
          ))}
        </div>

        {form.type !== 'listes' && (
          <div className="flex gap-4 mb-8">
            <SelectionToggle
              icon={Users}
              label="Par Group"
              isSelected={isParGroupSelected}
              onClick={() => setIsParGroupSelected(true)}
            />
            <SelectionToggle
              icon={User}
              label="Par Stagiaire"
              isSelected={!isParGroupSelected}
              onClick={() => setIsParGroupSelected(false)}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderForm()}
        </form>
      </div>

      <PrintWrapper ref={printRef} onPrint={onPrint} className=" w-full h-full">
        <div id="convocation" className="w-full h-full flex items-center justify-center">
          {renderDocument()}
        </div>
      </PrintWrapper>
    </div>
  );
};

export default Docs;
