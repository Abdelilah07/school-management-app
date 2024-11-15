import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteGroupAPI, fetchGroups, updateGroupAPI } from './groupsSlice';
import ModalGroup from './ModalGroup';
import EditGroupModal from './EditModal';
import AddGroup from './addGroup';
import { Edit, Eye, Trash2,Clock,Component, Download, Plus, X, AlertCircle, Users } from 'lucide-react';

const ListeGroupe = () => {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.groups.groups);
  const [selectedNiveau, setSelectedNiveau] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false); // Added state for "Add Group" modal

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  const handleSelectChange = (event) => {
    setSelectedNiveau(event.target.value);
  };

  const handleDeleteGroup = async (id) => {
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer ce groupe ?');
    if (confirmDelete) {
      try {
        await dispatch(deleteGroupAPI(id)).unwrap();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert(`Une erreur est survenue lors de la suppression: ${error}`);
      }
    }
  };

  const handleViewGroup = (group) => {
    setSelectedGroup(group);
    setIsEditMode(false); 
    setIsModalOpen(true);
  };

  const handleEditGroup = (group) => {
    setSelectedGroup(group);
    setIsEditMode(true); 
    setIsModalOpen(true);
  };

  const handleAddGroup = () => {
    setSelectedGroup(null);        // Reset selected group
    setIsEditMode(false);          // Set to "add" mode
    setIsModalOpen(true);          // Open the modal
    setIsAddingGroup(true);  // Open the "Add Group" modal
  };

  const handleUpdateGroup = async (updatedGroup) => {
    try {
      await dispatch(updateGroupAPI(updatedGroup)).unwrap();
      // alert('Group updated successfully!');
      dispatch(fetchGroups());
     
    } catch (error) {
      console.error('Error updating group:', error);
      // alert('Failed to update group');
    }
  };

  const exportGroup = () => {
    const headers = ['ID', 'Code Groupe', 'Niveau', 'Intitule Groupe', 'Filiere', 'Module', 'Emploi du temps', 'Liste'];
    const rows = groups.map((group) => [
      group.codeGroupe,
      group.niveau,
      group.intituleGroupe,
      group.filiere,
      group.modules,
      group.emploiDuTemps,
      group.liste,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
    link.download = 'Groupes.csv';
    link.click();
  };

  const filteredGroups = selectedNiveau
    ? groups.filter((group) => group.niveau === selectedNiveau)
    : groups;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Groupes</h1>

      {/* Filtre par niveau */}
      <div className="mb-6">
        <select
          className="block w-1/2 p-3 border rounded-lg mb-4"
          value={selectedNiveau}
          onChange={handleSelectChange}
        >
          <option value="">Tous les Groupes</option>
          {[...new Set(groups.map((group) => group.niveau))].map((niveau) => (
            <option key={niveau} value={niveau}>
              {niveau}
            </option>
          ))}
        </select>
        
        <div className="flex gap-4">
          <button
            className="btn btn-accent  gap-2"
            onClick={handleAddGroup} // Open Add Group modal on click
          >
            <Plus className="w-5 h-5" /> Add Group
           
          </button>
          <button
            className="btn btn-success  gap-2"
            onClick={exportGroup}
          >   
          <Download className="w-5 h-5" />
            Export Groupes 
         
          </button>
        </div>
      </div>

      {/* Table des groupes */}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-3 px-4 text-left">Code Groupe</th>
            <th className="py-3 px-4 text-left">Niveau</th>
            <th className="py-3 px-4 text-left">Intitulé Groupe</th>
            <th className="py-3 px-4 text-left">Filière</th>
            <th className="py-3 px-4 text-left">Modules</th>
            <th className="py-3 px-4 text-left">Emploi du Temps</th>
            <th className="py-3 px-4 text-left">Liste</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredGroups.map((group) => (
            <tr key={group.id} className="border-b">
              <td className="py-2 px-4">{group.codeGroupe}</td>
              <td className="py-2 px-4">{group.niveau}</td>
              <td className="py-2 px-4">{group.intituleGroupe}</td>
              <td className="py-2 px-4">{group.filiere}</td>
              <td className="py-2 px-4">
                <Link to={`/modules/${group.codeGroupe}`} 
                className="link flex items-center gap-2 text-blue-500 hover:underline">
                <Component className="w-4 h-4" />
                  Module
                </Link>
              </td>
              <td className="py-2 px-4">
                <Link to={`/emploiDuTemps/${group.codeGroupe}`} 
                className="link text-blue-500 flex items-center gap-2 ">
                <Clock className="w-4 h-4" />
                  TimeTable
                </Link>
              </td>
              <td className="py-2 px-4">
                <Link to={`/liste/${group.codeGroupe}`} 
                className="link text-blue-500 flex items-center gap-2">
                <Users className="w-4 h-4" />
                  Liste
                </Link>
              </td>
              <td className="py-2 px-4 flex gap-2">
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => handleViewGroup(group)}
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleEditGroup(group)}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => handleDeleteGroup(group.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal view */}
      {isModalOpen && selectedGroup && !isEditMode && !isAddingGroup &&(
        <ModalGroup group={selectedGroup} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
      {/* Modal edit */}
      {isModalOpen && selectedGroup && isEditMode && (
        <EditGroupModal
          group={selectedGroup}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleUpdateGroup}
        />
      )}
      {/* Modal add */}
      {isModalOpen && isAddingGroup && !isEditMode && (
        <AddGroup
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ListeGroupe;
