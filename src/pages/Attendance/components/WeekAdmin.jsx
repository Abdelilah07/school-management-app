import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { isWithinInterval, parseISO } from 'date-fns';
import FiltersAdmin from './FiltersAdmin';
import { Edit, Save, X } from 'lucide-react';

// Extend dayjs with the week of year plugin
dayjs.extend(weekOfYear);

const WeekAdmin = () => {
  // State for all filters
  const [allData, setAllData] = useState([]);
  const [niveau, setNiveau] = useState('');
  const [filiere, setFiliere] = useState('');
  const [annee, setAnnee] = useState('');
  const [groupe, setGroupe] = useState('');
  const [cin, setCin] = useState('');
  const [cef, setCef] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');

  // State for week selection
  const [selectedWeek, setSelectedWeek] = useState('');
  const [startOfWeek, setStartOfWeek] = useState(dayjs().startOf('week'));

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);

  // Editing states
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [editedAbsences, setEditedAbsences] = useState({});

  // Generate days of the week
  const daysOfWeek = Array.from({ length: 6 }, (_, i) => startOfWeek.add(i + 1, 'day'));

  // Calculate end of week
  const endOfWeek = daysOfWeek[daysOfWeek.length - 1];

  useEffect(() => {
    fetchAbsentStudents();
    // Load edited absences from localStorage
    const savedAbsences = localStorage.getItem('editedAbsences');
    if (savedAbsences) {
      setEditedAbsences(JSON.parse(savedAbsences));
    }
  }, [startOfWeek]);

  const fetchAbsentStudents = async () => {
    try {
      const response = await fetch('http://localhost:3000/absentStudents');
      const data = await response.json();
      setAllData(data || []);
    } catch (error) {
      console.error('Error fetching absent students:', error);
      setAllData([]);
    }
  };

  const handleWeekChange = (value) => {
    setSelectedWeek(value);
    const [year, week] = value.split('-W');
    setStartOfWeek(dayjs().year(parseInt(year)).week(parseInt(week)).startOf('week'));
  };

  const handleAbsenceTypeChange = (studentId, date, absenceType) => {
    setHasChanges(true);

    const newEditedAbsences = {
      ...editedAbsences,
      [studentId]: {
        ...(editedAbsences[studentId] || {}),
        [date]: absenceType,
      },
    };

    setEditedAbsences(newEditedAbsences);

    // Save to localStorage
    localStorage.setItem('editedAbsences', JSON.stringify(newEditedAbsences));

    // Update the allData state to reflect the change immediately
    setAllData((prevData) =>
      prevData.map((record) => {
        if (record.date === date) {
          return {
            ...record,
            students: record.students.map((student) => {
              if (student.studentId === studentId) {
                return {
                  ...student,
                  absenceType: absenceType, // Update the absenceType
                };
              }
              return student; // Keep other students unchanged
            }),
          };
        }
        return record; // Keep other records unchanged
      })
    );
  };

  const processAbsentStudents = () => {
    const filteredRecords = allData.filter((record) => {
      const recordDate = parseISO(record.date);
      const isInSelectedWeek = isWithinInterval(recordDate, {
        start: daysOfWeek[0].toDate(),
        end: daysOfWeek[daysOfWeek.length - 1].toDate(),
      });

      const niveauMatch = !niveau || record.niveau === niveau;
      const filiereMatch = !filiere || record.filiere === filiere;
      const anneeMatch = !annee || record.annee === annee;
      const groupeMatch = !groupe || record.groupe === groupe;

      return isInSelectedWeek && niveauMatch && filiereMatch && anneeMatch && groupeMatch;
    });

    // Retrieve saved absences from localStorage
    const savedAbsences = JSON.parse(localStorage.getItem('editedAbsences') || '{}');

    const studentMap = new Map();

    filteredRecords.forEach((record) => {
      record.students.forEach((student) => {
        const cinMatch = !cin || student.studentCin.includes(cin);
        const cefMatch = !cef || student.studentCef.includes(cef);
        const nomMatch = !nom || student.studentName.toLowerCase().includes(nom.toLowerCase());
        const prenomMatch =
          !prenom || student.studentName.toLowerCase().includes(prenom.toLowerCase());

        // Check for full morning and afternoon absences
        const morningAbsent =
          student.absentHours['8:30->10:50'] && student.absentHours['10:50->13.30'];
        const afternoonAbsent =
          student.absentHours['13.30->15.50'] && student.absentHours['15.50->18.30'];
        const isFullSessionAbsent = morningAbsent || afternoonAbsent;

        if (cinMatch && cefMatch && nomMatch && prenomMatch && isFullSessionAbsent) {
          const studentKey = student.studentId;

          if (!studentMap.has(studentKey)) {
            studentMap.set(studentKey, {
              ...student,
              niveau: record.niveau,
              filiere: record.filiere,
              annee: record.annee,
              groupe: record.groupe,
              absenceDates: new Set(),
              absenceDetails: {},
            });
          }

          const studentData = studentMap.get(studentKey);
          studentData.absenceDates.add(record.date);

          // Prioritize saved absence type from localStorage, default to ANJ
          const savedStudentAbsences = savedAbsences[studentKey] || {};
          studentData.absenceDetails[record.date] = savedStudentAbsences[record.date] || 'ANJ';

          // Increment total absences by 2 if both morning and afternoon are fully absent
          if (morningAbsent && afternoonAbsent) {
            // Add another absence entry to reflect both morning and afternoon absence
            studentData.absenceDates.add(`${record.date}-afternoon`);
            studentData.absenceDetails[`${record.date}-afternoon`] =
              savedStudentAbsences[`${record.date}-afternoon`] || 'ANJ';
          }
        }
      });
    });

    return Array.from(studentMap.values()).map((student) => ({
      ...student,
      totalAbsences: student.absenceDates.size,
      absenceDates: student.absenceDates,
    }));
  };

  const isStudentAbsentOnDay = (student, day) => {
    return student.absenceDates.has(day.format('YYYY-MM-DD'));
  };

  const handleSave = async () => {
    try {
      // Prepare the data to be saved
      const updatedStudents = processedAbsentStudents.map((student) => {
        const studentEditedAbsences = editedAbsences[student.studentId] || {};

        // Merge existing absence details with edited absences
        const mergedAbsenceDetails = {
          ...student.absenceDetails,
          ...studentEditedAbsences,
        };

        return {
          ...student,
          absenceDetails: mergedAbsenceDetails,
          totalAbsences: Object.keys(mergedAbsenceDetails).length,
        };
      });

      const response = await fetch('http://localhost:3000/studentDiscipline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedStudents),
      });

      if (!response.ok) {
        throw new Error('Failed to update students');
      }

      // Reset states after successful save
      setIsEditing(false);
      setHasChanges(false);
      setEditedAbsences({});
      localStorage.removeItem('editedAbsences'); // Clear localStorage after saving
      fetchAbsentStudents(); // Refetch to get updated data
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setHasChanges(false);
    setEditedAbsences({});
    localStorage.removeItem('editedAbsences'); // Clear localStorage on cancel
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const processedAbsentStudents = processAbsentStudents();

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = processedAbsentStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedAbsentStudents.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto py-8 px-10">
      <FiltersAdmin
        allData={allData}
        niveau={niveau}
        filiere={filiere}
        annee={annee}
        groupe={groupe}
        cin={cin}
        cef={cef}
        nom={nom}
        prenom={prenom}
        selectedWeek={selectedWeek}
        onNiveauChange={setNiveau}
        onFiliereChange={setFiliere}
        onAnneeChange={setAnnee}
        onGroupeChange={setGroupe}
        onCinChange={setCin}
        onCefChange={setCef}
        onNomChange={setNom}
        onPrenomChange={setPrenom}
        onWeekChange={handleWeekChange}
        isWeekAdminPage={true}
        showExport={false}
      />

      <div className="overflow-x-auto rounded-lg shadow-md">
        {currentItems.length > 0 ? (
          <>
            <table className="table w-full text-center">
              <thead>
                <tr>
                  <th>CEF</th>
                  <th>CIN</th>
                  <th>Full Name</th>
                  <th>Total Absences</th>
                  <th>
                    {`${startOfWeek.format('DD/MM/YYYY')} - ${endOfWeek.format('DD/MM/YYYY')}`}
                    <div className="grid grid-cols-6 gap-1 mt-2">
                      {daysOfWeek.map((day) => (
                        <div key={day.toString()} className="text-xs text-center">
                          {day.format('dddd')}
                        </div>
                      ))}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((student) => (
                  <tr key={student.studentId}>
                    <td>{student.studentCef}</td>
                    <td>{student.studentCin}</td>
                    <td>{student.studentName}</td>
                    <td>{student.totalAbsences || 0}</td>
                    <td>
                      <div className="grid grid-cols-6 gap-1">
                        {daysOfWeek.map((day) => (
                          <div
                            key={`${student.studentId}-${day.toString()}`}
                            className="text-center"
                          >
                            {isStudentAbsentOnDay(student, day) ? (
                              <div>
                                <span className="text-red-600 font-bold">Absent</span>
                                <div className="flex flex-col items-center space-y-1 mt-1">
                                  <div className="tooltip flex pr-2" data-tip="Absence Justifiée">
                                    <input
                                      type="radio"
                                      name={`absence-${student.studentId}-${day.format('YYYY-MM-DD')}`}
                                      className="radio radio-primary radio-sm mr-1"
                                      disabled={!isEditing}
                                      checked={
                                        (editedAbsences[student.studentId]?.[
                                          day.format('YYYY-MM-DD')
                                        ] || student.absenceDetails[day.format('YYYY-MM-DD')]) ===
                                        'AJ'
                                      }
                                      onChange={() =>
                                        handleAbsenceTypeChange(
                                          student.studentId,
                                          day.format('YYYY-MM-DD'),
                                          'AJ'
                                        )
                                      }
                                    />
                                    <span className="block text-xs">AJ</span>
                                  </div>
                                  <div className="tooltip flex" data-tip="Absence Non Justifiée">
                                    <input
                                      type="radio"
                                      name={`absence-${student.studentId}-${day.format('YYYY-MM-DD')}`}
                                      className="radio radio-error radio-sm mr-1"
                                      disabled={!isEditing}
                                      checked={
                                        (editedAbsences[student.studentId]?.[
                                          day.format('YYYY-MM-DD')
                                        ] || student.absenceDetails[day.format('YYYY-MM-DD')]) ===
                                        'ANJ'
                                      }
                                      onChange={() =>
                                        handleAbsenceTypeChange(
                                          student.studentId,
                                          day.format('YYYY-MM-DD'),
                                          'ANJ'
                                        )
                                      }
                                    />
                                    <span className="block text-xs">ANJ</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <span>-</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between mt-4 mb-4 px-4">
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
              <div className="space-x-2 flex flex-wrap gap-2 justify-end">
                <button className="btn btn-primary" onClick={handleEdit} disabled={isEditing}>
                  <Edit size={20} className="mr-2" />
                  Modifier
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleSave}
                  disabled={!isEditing || !hasChanges}
                >
                  <Save size={20} className="mr-2" />
                  Enregistrer
                </button>
                <button className="btn btn-error" onClick={handleCancel} disabled={!isEditing}>
                  <X size={20} className="mr-2" />
                  Annuler
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center py-4">Aucun étudiant trouvé pour ces critères.</p>
        )}
      </div>
    </div>
  );
};

export default WeekAdmin;
