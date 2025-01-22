import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setShowAddAssignmentModal,
  addAssignment,
  updateAssignment,
  deleteAssignment,
} from '../../../features/scheduler/schedulerSlice';
import { Modal } from '../../../components';
import dayjs from 'dayjs';
import { Captions, Calendar, Pause, Play, Plus, Save, Trash2, User, Users } from 'lucide-react';
import AssignmentField from './AssignmentFields';

export default function AssignmentModal() {
  const dispatch = useDispatch();
  const {
    showAddAssignmentModal,
    hours,
    selectedDay,
    selectedStartTime,
    selectedEndTime,
    assignments,
    selectedGroupe,
    selectedFormateur,
    salles,
    startOfWeek 
  } = useSelector((state) => state.scheduler);

  const timeSlots = hours.flatMap((hour) => hour.subHours);
  const existingAssignment = assignments.find(
    (assignment) =>
      assignment.day === selectedDay &&
      assignment.startTime === selectedStartTime &&
      assignment.endTime === selectedEndTime &&
      (assignment.groupe.codeGroupe === selectedGroupe ||
        assignment.formateur.matricule === selectedFormateur)
  );

  const [assignmentData, setAssignmentData] = useState({
    title: '',
    formateur: {
      matricule: '',
      nom: '',
      email: '',
      secteur: '',
    },
    groupe: {
      codeGroupe: selectedGroupe || '',
      intituleGroupe: '',
      filiere: '',
      secteur: '',
    },
    salle: '',
    day: '',
    startTime: '',
    endTime: '',
    id: null,
  });

  const findGroupDetails = (codeGroupe) =>
    assignments.find((assignment) => assignment.groupe.codeGroupe === codeGroupe)?.groupe || {};

  const findFormateurDetails = (matricule) =>
    assignments.find((assignment) => assignment.formateur.matricule === matricule)?.formateur || {};

  const getFormateursForGroup = (group) =>
    assignments
      .filter((assignment) => assignment.groupe.codeGroupe === group?.codeGroupe)
      .map((assignment) => assignment.formateur)
      .filter(
        (formateur, index, self) =>
          formateur && index === self.findIndex((f) => f?.matricule === formateur?.matricule)
      );

  const getGroupsForFormateur = (formateur) =>
    assignments
      .filter((assignment) => assignment.formateur?.matricule === formateur?.matricule)
      .map((assignment) => assignment.groupe)
      .filter(
        (groupe, index, self) =>
          groupe && index === self.findIndex((g) => g?.codeGroupe === groupe?.codeGroupe)
      );

  useEffect(() => {
    if (showAddAssignmentModal && selectedStartTime && selectedEndTime) {
      if (existingAssignment) {
        setAssignmentData(existingAssignment);
      } else {
        const groupDetails = selectedGroupe ? findGroupDetails(selectedGroupe) : {};
        const formateurDetails = selectedFormateur ? findFormateurDetails(selectedFormateur) : {};

        setAssignmentData((prevData) => ({
          ...prevData,
          startTime: selectedStartTime,
          endTime: selectedEndTime,
          groupe: { ...prevData.groupe, ...groupDetails },
          formateur: { ...prevData.formateur, ...formateurDetails },
          id: null,
        }));
      }
    }
  }, [
    showAddAssignmentModal,
    selectedStartTime,
    selectedEndTime,
    existingAssignment,
    selectedGroupe,
    selectedFormateur,
  ]);

  const handleClose = () => {
    dispatch(setShowAddAssignmentModal(false));
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, startTime, endTime, formateur } = assignmentData;
    if (!title || !startTime || !endTime || !formateur.matricule) {
      alert('Please fill in all required fields.');
      return;
    }

    const updatedAssignmentData = {
      ...assignmentData,
      day: selectedDay || assignmentData.day,
    };

    if (updatedAssignmentData.id) {
      dispatch(updateAssignment(updatedAssignmentData));
    } else {
      dispatch(
        addAssignment({
          ...updatedAssignmentData,
          id: Date.now().toString(),
        })
      );
    }
    handleClose();
  };

  const handleDelete = () => {
    if (assignmentData.id) {
      dispatch(deleteAssignment(assignmentData.id));
      handleClose();
    }
  };

  const resetForm = () => {
    setAssignmentData({
      title: '',
      formateur: {
        matricule: '',
        nom: '',
        email: '',
        secteur: '',
      },
      groupe: {
        codeGroupe: selectedGroupe || '',
        intituleGroupe: '',
        filiere: '',
        secteur: '',
      },
      salle: '',
      day: '',
      startTime: '',
      endTime: '',
      id: null,
    });
  };

  if (!showAddAssignmentModal) return null;

  const renderFields = () => {
    const fieldsConfig = selectedGroupe
      ? [
          {
            label: 'Formateur',
            icon: User,
            value: assignmentData.formateur?.matricule || '',
            options: getFormateursForGroup(assignmentData.groupe).map((formateur) => ({
              value: formateur.matricule,
              label: formateur.nom,
            })),
            onChange: (matricule) =>
              setAssignmentData({
                ...assignmentData,
                formateur: getFormateursForGroup(assignmentData.groupe).find(
                  (f) => f.matricule === matricule
                ),
              }),
          },
        ]
      : [
          {
            label: 'Groupe',
            icon: Users,
            value: assignmentData.groupe?.codeGroupe || '',
            options: getGroupsForFormateur(assignmentData.formateur).map((groupe) => ({
              value: groupe.codeGroupe,
              label: groupe.intituleGroupe,
            })),
            onChange: (codeGroupe) =>
              setAssignmentData({
                ...assignmentData,
                groupe: getGroupsForFormateur(assignmentData.formateur).find(
                  (g) => g.codeGroupe === codeGroupe
                ),
              }),
          },
        ];

    return fieldsConfig.map((field, index) => (
      <AssignmentField
        key={index}
        label={field.label}
        icon={field.icon}
        value={field.value}
        options={field.options}
        onChange={field.onChange}
      />
    ));
  };

  return (
    <Modal isOpen={showAddAssignmentModal} onClose={handleClose} maxWidth="max-w-xl">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6">
          {assignmentData.id ? 'Edit Assignment' : 'Add Assignment'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <Captions className="w-4 h-4" />
                Title
              </span>
            </label>
            <input
              type="text"
              value={assignmentData.title}
              onChange={(e) => setAssignmentData({ ...assignmentData, title: e.target.value })}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <Play className="w-4 h-4" />
                Start Time
              </span>
            </label>
            <select
              value={assignmentData.startTime}
              onChange={(e) => setAssignmentData({ ...assignmentData, startTime: e.target.value })}
              className="select select-bordered w-full"
              required
            >
              <option value="">Select Start Time</option>
              {timeSlots.map((slot, index) => (
                <option key={index} value={slot.startTime}>
                  {slot.startTime}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <Pause className="w-4 h-4" />
                End Time
              </span>
            </label>
            <select
              value={assignmentData.endTime}
              onChange={(e) => setAssignmentData({ ...assignmentData, endTime: e.target.value })}
              className="select select-bordered w-full"
              required
            >
              <option value="">Select End Time</option>
              {timeSlots.map((slot, index) => (
                <option key={index} value={slot.endTime}>
                  {slot.endTime}
                </option>
              ))}
            </select>
          </div>
          {selectedGroupe || selectedFormateur ? (
            renderFields()
          ) : (
            <>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Day
                    </span>
                  </label>
                  <select
                    value={assignmentData.day}
                    onChange={(e) => setAssignmentData({ ...assignmentData, day: e.target.value })}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="">Select Day</option>
                    {Array.from({ length: 6 }, (_, i) => {
                      const date = dayjs(startOfWeek).add(i, 'day');
                      return (
                        <option key={i} value={date.format('YYYY-MM-DD')}>
                          {date.format('dddd, D MMM')}
                        </option>
                      );
                    })}
                  </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Groupe
                  </span>
                </label>
                <select
                  value={assignmentData.groupe.codeGroupe}
                  onChange={(e) => {
                    const codeGroupe = e.target.value;
                    const selectedGroup = assignments
                      .map(assignment => assignment.groupe)
                      .find(groupe => groupe.codeGroupe === codeGroupe);
                    setAssignmentData({
                      ...assignmentData,
                      groupe: selectedGroup || {
                        codeGroupe: '',
                        intituleGroupe: '',
                        filiere: '',
                        secteur: '',
                      }
                    });
                  }}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Select Groupe</option>
                  {[...new Set(assignments.map(a => a.groupe))].map((groupe, index) => (
                    <option key={index} value={groupe.codeGroupe}>
                      {groupe.intituleGroupe} ({groupe.codeGroupe})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Formateur
                  </span>
                </label>
                <select
                  value={assignmentData.formateur.matricule}
                  onChange={(e) => {
                    const matricule = e.target.value;
                    const selectedFormateur = assignments
                      .map(assignment => assignment.formateur)
                      .find(formateur => formateur.matricule === matricule);
                    setAssignmentData({
                      ...assignmentData,
                      formateur: selectedFormateur || {
                        matricule: '',
                        nom: '',
                        email: '',
                        secteur: '',
                      }
                    });
                  }}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Select Formateur</option>
                  {[...new Set(assignments.map(a => a.formateur))].map((formateur, index) => (
                    <option key={index} value={formateur.matricule}>
                      {formateur.nom} ({formateur.matricule})
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Salle
              </span>
            </label>
            <select
              value={assignmentData.salle}
              onChange={(e) => setAssignmentData({ ...assignmentData, salle: e.target.value })}
              className="select select-bordered w-full"
              required
            >
              <option value="">Select la salle</option>
              {salles.map((salle, index) => (
                <option key={index} value={salle}>
                  {salle}
                </option>
                ))}
          </select>
          </div>
          <div className="flex justify-between items-center mt-4">
            <button type="submit" className="btn btn-primary" aria-label="Save Assignment">
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
            {assignmentData.id && (
              <button
                type="button"
                className="btn btn-error"
                onClick={handleDelete}
                aria-label="Delete Assignment"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
}
