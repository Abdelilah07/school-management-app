import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addCourse } from '../../features/coursesFormateur/coursesFormateurSlice'; // Adjust path as needed

const AddCourse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [newCourse, setNewCourse] = useState({
    Module: '',
    courseName: '',
    teacherName:'',
    courseDescription:'',
    teacherId:'',
    videoLink: '',
    imageUrl: '',
    pdfUrl: '',
    status: 'active',
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Create the course data with the new information
    const courseData = { ...newCourse};

    // Add the course using Redux action
    dispatch(addCourse(courseData));
    // Reset form and navigate to course list
    setNewCourse({ courseId: '', Module: '', courseName: '', imageUrl: '', pdfUrl: '' });
    navigate('/courses');
  };

  return (
    <div className="p-8 bg-base-100">
      <h1 className="text-3xl font-bold text-center mb-6">Add New Course</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">

        {/* Module */}
        <div>
          <label className="block font-semibold">Module</label>
          <input
            type="text"
            name="Module"
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter the Module Name"
            required
          />
        </div>

        {/* courseName */}
        <div>
          <label className="block font-semibold">courseName</label>
          <input
            type="text"
            name="courseName"
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter the courseName"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">ID du formateur</label>
          <input
            type="text"
            name="teacherId"
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter The ID of the teacher"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Nom du formateur</label>
          <input
            type="text"
            name="teacherName"
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter the Name of the teacher"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Course description</label>
          <input
            type="text"
            name="courseDescription"
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter the course description"
            required
          />
        </div>
        {/* videoUrl */}
        <div>
          <label className="block font-semibold">videoUrl</label>
          <input
            type="text"
            name="videoLink"
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter  video URL"
            required
          />
        </div>
        {/* imageUrl */}
        <div>
          <label className="block font-semibold">imageUrl URL</label>
          <input
            type="text"
            name="imageUrl"
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter  Image URL"
            required
          />
        </div>

        {/* PDF Upload */}
        <div>
          <label className="block font-semibold">Upload PDF</label>
          <input
            type="text"
            name="pdfUrl"
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="Enter the pdf link"
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-full">
          Add Course
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
