import React, { useState, useEffect } from 'react';
import FiltersFormateur from './FiltersFormateur';
import { Save, X, Edit } from 'lucide-react';
import { BsPersonFillSlash } from 'react-icons/bs';

export default function AttendanceFormateur() {
  const [secteursData, setSecteursData] = useState([]);
  const [secteur, setSecteur] = useState('');
  const [niveau, setNiveau] = useState('');
  const [filiere, setFiliere] = useState('');
  const [annee, setAnnee] = useState('');
  const [groupe, setGroupe] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [absentStudents, setAbsentStudents] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [checkboxDisabled, setCheckboxDisabled] = useState(false);

  const morningTimeSlots = ['8:30->10:50', '10:50->13.30'];
  const afternoonTimeSlots = ['13.30->15.50', '15.50->18.30'];

  const getTimeSlots = () => {
    const currentHour = new Date().getHours();
    return currentHour < 12 ? morningTimeSlots : afternoonTimeSlots;
  };

  const [timeSlots, setTimeSlots] = useState(getTimeSlots());

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = students.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(students.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const updateTimeSlots = () => {
      if (!isDateInPast(dateFilter)) {
        setTimeSlots(getTimeSlots());
      } else {
        setTimeSlots([...morningTimeSlots, ...afternoonTimeSlots]);
      }
    };

    updateTimeSlots();
    const interval = setInterval(updateTimeSlots, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [dateFilter]);
  useEffect(() => {
    const fetchSecteursData = async () => {
      try {
        const response = await fetch('http://localhost:3000/secteurs');
        const data = await response.json();
        setSecteursData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchSecteursData();
  }, []);
  const separateNames = (fullName) => {
    const names = fullName.split(' ');
    const lastName = names.pop();
    const firstName = names.join(' ');
    return { firstName, lastName };
  };

  useEffect(() => {
    if (secteur && niveau && filiere && annee && groupe) {
      const selectedSecteur = secteursData.find((s) => s.intitule_secteur === secteur);
      if (selectedSecteur) {
        const groupData = selectedSecteur.niveaux[niveau]?.filiere[filiere]?.[annee]?.[groupe];
        setStudents(
          groupData?.map((student) => ({
            ...student,
            absentHours: timeSlots.reduce((acc, slot) => ({ ...acc, [slot]: false }), {}),
          })) || []
        );
      }
    } else {
      setStudents([]);
    }
  }, [secteur, niveau, filiere, annee, groupe, secteursData]);

  const isDateInPast = (selectedDate) => {
    const today = new Date().toISOString().split('T')[0];
    return selectedDate < today;
  };

  const fetchAbsentStudents = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/absentStudents?date=${dateFilter}&niveau=${niveau}&filiere=${filiere}&annee=${annee}&groupe=${groupe}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch absent students');
      const data = await response.json();
      console.log('Fetched data:', data);
      // Find the matching record in the array
      const matchingRecord = data.find(
        (record) =>
          record.niveau === niveau &&
          record.filiere === filiere &&
          record.annee === annee &&
          record.groupe === groupe &&
          record.date === dateFilter
      );
      setAbsentStudents(matchingRecord ? [matchingRecord] : []);
    } catch (error) {
      console.error('Error fetching absent students:', error);
      setError('Failed to fetch absent students. Please try again.');
    }
  };

  useEffect(() => {
    if (isDateInPast(dateFilter) && dateFilter && niveau && filiere && annee && groupe) {
      fetchAbsentStudents();
    } else {
      setAbsentStudents([]);
    }
  }, [dateFilter, niveau, filiere, annee, groupe]);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const parsedDate = new Date(selectedDate);
    if (isNaN(parsedDate.getTime())) {
      setError('Invalid date selected.');
      return;
    }

    const formattedDate = parsedDate.toISOString().split('T')[0];
    setDateFilter(formattedDate);
    setEditing(!isDateInPast(formattedDate));
    setIsSaved(false);
    setAbsentStudents([]); // Reset absentStudents when a new date is selected
  };

  const handleCheckboxChange = (studentId, timeSlot) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              absentHours: { ...student.absentHours, [timeSlot]: !student.absentHours[timeSlot] },
            }
          : student
      )
    );
  };

  const saveSelectionsToAPI = async (absentStudents) => {
    try {
      const monthInLetters = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
        new Date(dateFilter)
      );

      const registrationTime = new Date().toISOString();

      const response = await fetch('http://localhost:3000/absentStudents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          niveau,
          filiere,
          annee,
          groupe,
          date: dateFilter,
          month: monthInLetters,
          registrationTime,
          students: absentStudents.map((student) => ({
            studentId: student.id,
            studentCef: student.cef,
            studentName: student.fullname,
            studentCin: student.cin,
            absentHours: student.absentHours,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save absent students');
      }
    } catch (error) {
      console.error('Error saving absent students:', error);
      setError('Failed to save absent students. Please try again.');
    }
  };

  const saveSelections = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const absentStudents = students.filter((s) => Object.values(s.absentHours).some(Boolean));
      if (absentStudents.length === 0) {
        setError('No students marked as absent.');
        setIsSaving(false);
        return;
      }

      await saveSelectionsToAPI(absentStudents);
      setIsSaving(false);
      setIsSaved(true);
      setEditing(false);
      setCheckboxDisabled(true);
    } catch {
      setError('Failed to save selections.');
      setIsSaving(false);
    }
  };

  return (
    <div className="">
      <div className="w-full p-4 mb-[-3%] flex flex-col items-end">
        <div className="flex space-x-6 bg-base-200 p-3 rounded-t-3xl">
          <h2 className="text-2xl font-semibold">Current Filiere :</h2>
          <p className="text-2xl from-neutral-950">
            {filiere || '-'} {groupe || '-'}
          </p>
        </div>
      </div>
      <div className="w-full p-4">
        <FiltersFormateur
          secteursData={secteursData}
          secteur={secteur}
          niveau={niveau}
          filiere={filiere}
          annee={annee}
          groupe={groupe}
          dateFilter={dateFilter}
          onSecteurChange={setSecteur}
          onNiveauChange={setNiveau}
          onFiliereChange={setFiliere}
          onAnneeChange={setAnnee}
          onGroupeChange={setGroupe}
          onDateChange={handleDateChange}
          students={students}
        />

        <div className="overflow-x-auto rounded-lg shadow-md mt-4">
          <table className="table table-zebra w-full hover border-collapse border border-gray-300">
            <thead className="bg-base-200">
              <tr className="text-center font-bold text-black text-[15px] border border-gray-300">
                <th className="border border-gray-300">ID</th>
                <th className="border border-gray-300">CEF</th>
                <th className="border border-gray-300">First Name</th>
                <th className="border border-gray-300">Last Name</th>
                {timeSlots.map((slot) => (
                  <th key={slot} className="border border-gray-300">
                    {slot}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-center">
              {isDateInPast(dateFilter) ? (
                absentStudents.length > 0 && absentStudents[0].students ? (
                  absentStudents[0].students.map((student) => {
                    const { firstName, lastName } = separateNames(student.studentName);
                    return (
                      <tr key={student.studentId}>
                        <td className="border border-gray-300">{student.studentId}</td>
                        <td className="border border-gray-300">{student.studentCef}</td>
                        <td className="border border-gray-300">{firstName}</td>
                        <td className="border border-gray-300">{lastName}</td>
                        {timeSlots.map((slot) => (
                          <td key={slot} className="text-center border border-gray-300">
                            {student.absentHours[slot] ? (
                              <BsPersonFillSlash size={25} color="red" className="mx-auto" />
                            ) : (
                              '------'
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={4 + [...morningTimeSlots, ...afternoonTimeSlots].length}
                      className="text-center"
                    >
                      No absent students data available for this date.
                    </td>
                  </tr>
                )
              ) : students.length > 0 ? (
                students
                  .sort((a, b) => a.fullname.split(' ')[1].localeCompare(b.fullname.split(' ')[1]))
                  .map((student) => {
                    const { firstName, lastName } = separateNames(student.fullname);
                    return (
                      <tr key={student.id}>
                        <td className="border border-gray-300">{student.id}</td>
                        <td className="border border-gray-300">{student.cef}</td>
                        <td className="border border-gray-300">{firstName}</td>
                        <td className="border border-gray-300">{lastName}</td>
                        {timeSlots.map((slot) => (
                          <td key={slot} className="text-center border border-gray-300">
                            <input
                              type="checkbox"
                              className="checkbox checkbox-primary"
                              checked={student.absentHours[slot]}
                              onChange={() => handleCheckboxChange(student.id, slot)}
                              disabled={checkboxDisabled}
                            />
                          </td>
                        ))}
                      </tr>
                    );
                  })
              ) : (
                <tr>
                  <td colSpan={4 + timeSlots.length} className="text-center">
                    No students available for this selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <div className="btn-group">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`btn ${currentPage === i + 1 ? 'btn-active' : ''}`}
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        <div className="space-x-2 flex flex-wrap gap-2 justify-end mt-4">
          {editing ? (
            <>
              <button className="btn btn-primary" onClick={saveSelections} disabled={isSaving}>
                <Save size={20} className="mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setEditing(false);
                  setStudents((prev) =>
                    prev.map((student) => ({
                      ...student,
                      absentHours: timeSlots.reduce((acc, slot) => ({ ...acc, [slot]: false }), {}),
                    }))
                  );
                }}
                disabled={isSaving}
              >
                <X size={20} className="mr-2" />
                Cancel
              </button>
            </>
          ) : (
            <button
              className="btn btn-accent"
              onClick={() => {
                setEditing(true);
                setCheckboxDisabled(false);
              }}
              disabled={isDateInPast(dateFilter)}
            >
              <Edit size={20} className="mr-2" />
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
