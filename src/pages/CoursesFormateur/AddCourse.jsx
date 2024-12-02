import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addCourse } from '../../features/coursesFormateur/coursesFormateurSlice'; // Adjust path as needed
import jsPDF from 'jspdf';

const AddCourse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [newCourse, setNewCourse] = useState({
    courseId: '',
    Module: '',
    courseName: '',
    imageUrl: '',
    pdfUrl: '',
  });

  const [pdfFile, setPdfFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate a unique ID for the course
    const id = Math.random().toString(36).substring(2, 9);

    // Create the course data with the new information
    const courseData = { ...newCourse, id };

    // Add the course using Redux action
    dispatch(addCourse(courseData));

    // Generate PDF with jsPDF
    const doc = new jsPDF();
    doc.text(`Course ID: ${newCourse.courseId}`, 10, 10);
    doc.text(`Module: ${newCourse.Module}`, 10, 20);
    doc.text(`courseName: ${newCourse.courseName}`, 10, 30);
    doc.text(`imageUrl: ${newCourse.imageUrl}`, 10, 40);
    doc.text(`pdfUrl: ${newCourse.pdfUrl}`, 10, 50);

    // Reset form and navigate to course list
    setNewCourse({ courseId: '',Module: '',courseName: '',imageUrl: '',pdfUrl: ''});
    setPdfFile(null);
    navigate('/CoursesFormateur');
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
            placeholder="Enter Module Name"
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
            placeholder="Enter Course courseName"
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
            placeholder="Enter imageUrl Image URL"
            required
          />
        </div>

        {/* PDF Upload */}
        <div>
          <label className="block font-semibold">Upload PDF</label>
          <input
            type="text"
            onChange={handlePdfChange}
            className="input input-bordered w-full"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-full"
        >
          Add Course
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
