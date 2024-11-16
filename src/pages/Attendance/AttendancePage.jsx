import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

export default function Component() {
  const [data, setData] = useState(null);
  const [secteurs, setSecteurs] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [secteur, setSecteur] = useState('');
  const [filiere, setFiliere] = useState('');
  const [groupe, setGroupe] = useState('');
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState('');
  const [absentStudents, setAbsentStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/secteur');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
        setSecteurs(Object.keys(result));
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again.');
      }
    };

    fetchData();
  }, []);

  const isDateInPast = (selectedDate) => {
    const today = new Date().toISOString().split('T')[0];
    return selectedDate < today;
  };

  const fetchAbsentStudents = async (selectedDate) => {
    try {
      const response = await fetch(
        `http://localhost:3000/absentStudents?date=${selectedDate}&secteur=${secteur}&filiere=${filiere}&groupe=${groupe}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch absent students');
      }
      const result = await response.json();
      setAbsentStudents(result);
    } catch (error) {
      console.error('Error fetching absent students:', error);
      setError('Failed to load absent students. Please try again.');
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    try {
      const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
      setDateFilter(formattedDate);
      if (isDateInPast(formattedDate)) {
        fetchAbsentStudents(formattedDate);
        setEditing(false);
      } else {
        setEditing(true);
        setAbsentStudents([]);
      }
    } catch {
      setError('Invalid date selected.');
    }
  };

  const handleSecteurChange = (e) => {
    const value = e.target.value;
    setSecteur(value);
    setFilieres(Object.keys(data[value] || {}));
    setFiliere('');
    setGroupe('');
    setStudents([]);
    setEditing(false);
  };

  const handleFiliereChange = (e) => {
    const value = e.target.value;
    setFiliere(value);
    setGroupes(Object.keys(data[secteur][value] || {}));
    setGroupe('');
    setStudents([]);
    setEditing(false);
  };

  const handleGroupeChange = (e) => {
    const value = e.target.value;
    setGroupe(value);
    const studentsList = data[secteur][filiere][value] || [];
    setStudents(studentsList);
    setEditing(!isDateInPast(dateFilter));
  };

  const handleCheckboxChange = (id) => {
    setStudents((prevStudents) =>
      prevStudents.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s))
    );
  };

  const handleEditCancel = () => {
    setEditing(!editing);
    setStudents(students.map((s) => ({ ...s, selected: false })));
  };

  const saveSelectionsToAPI = async (updatedStudents) => {
    try {
      const response = await fetch('http://localhost:3000/absentStudents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secteur,
          filiere,
          groupe,
          date: dateFilter,
          students: updatedStudents.map((student) => ({
            studentId: student.id,
            studentCef: student.cef,
            studentName: student.fullname,
            studentDateN: student.dateNaissance,
            studentCin: student.cin,
            isAbsent: student.selected,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save selections');
      }
    } catch (error) {
      console.error('Error saving selections:', error);
      setError('Failed to save selections. Please try again.');
    }
  };

  const saveSelections = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const updatedStudents = students.map((s) => ({ ...s, selected: s.selected }));
      await saveSelectionsToAPI(updatedStudents);
      setEditing(false);
    } catch {
      setError('Failed to save selections.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {error && <div className="alert alert-error mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <select
          className="select select-bordered w-full"
          value={secteur}
          onChange={handleSecteurChange}
        >
          <option value="">Select Secteur</option>
          {secteurs.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered w-full"
          value={filiere}
          onChange={handleFiliereChange}
          disabled={!secteur}
        >
          <option value="">Select Filière</option>
          {filieres.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered w-full"
          value={groupe}
          onChange={handleGroupeChange}
          disabled={!filiere}
        >
          <option value="">Select Groupe</option>
          {groupes.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <div className="relative">
          <input
            type="date"
            className="input input-bordered w-full pr-10"
            value={dateFilter}
            onChange={handleDateChange}
          />
          <Calendar
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-lg shadow-lg mb-6">
        <table className="table w-full">
          <thead>
            <tr>
              {editing && <th>Action</th>}
              <th>CEF</th>
              <th>Full Name</th>
              <th>Date de Naissance</th>
              <th>CIN</th>
            </tr>
          </thead>
          <tbody>
            {(isDateInPast(dateFilter) ? absentStudents : students).map((student) => (
              <tr key={student.id}>
                {editing && (
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={student.selected || absentStudents.some((a) => a.id === student.id)}
                      onChange={() => handleCheckboxChange(student.id)}
                      disabled={!editing}
                    />
                  </td>
                )}
                <td>{student.cef}</td>
                <td>{student.fullname}</td>
                <td>{student.dateNaissance}</td>
                <td>{student.cin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end space-x-4">
        {editing ? (
          <>
            <button onClick={saveSelections} className="btn btn-primary">
              {isSaving ? 'Saving...' : 'Save Selections'}
            </button>
            <button onClick={handleEditCancel} className="btn btn-secondary">
              Cancel
            </button>
          </>
        ) : isDateInPast(dateFilter) ? (
          <div className="text-gray-500 italic">View-only mode for past dates</div>
        ) : (
          <button onClick={handleEditCancel} className="btn btn-primary">
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
