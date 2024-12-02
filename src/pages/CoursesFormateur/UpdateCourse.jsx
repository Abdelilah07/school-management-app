import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { updateCourse, fetchCourses } from '../../features/coursesFormateur/coursesFormateurSlice';
import jsPDF from 'jspdf';

const UpdateCourse = () => {
  const { courseId } = useParams(); // Match courseId from route params
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { courses, status } = useSelector((state) => state.courses);

  const [courseData, setCourseData] = useState({
    Module: '',
    courseName: '',
    imageUrl: '',
    pdfUrl: null,
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreviewData, setPdfPreviewData] = useState('');

  // Fetch courses or set course data when component mounts
  useEffect(() => {
    if (status === 'idle' && !courses.length) {
      dispatch(fetchCourses());
    } else {
      const course = courses.find((course) => course.id === courseId);
      if (course) {
        setCourseData(course);
      }
    }
  }, [dispatch, courseId, courses, status]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'pdfUrl' && files[0]) {
      setPdfFile(files[0]); // Store file
      const reader = new FileReader();
      reader.onload = (event) => {
        setPdfPreviewData(event.target.result); // Preview PDF
      };
      reader.readAsDataURL(files[0]);
    } else {
      setCourseData({ ...courseData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedCourse = {
      ...courseData,
      id: courseId, // Ensure the course ID is sent
      Module: courseData.Module,
      pdfUrl: pdfFile ? pdfFile.name : courseData.pdfUrl, // File name or existing value
    };

    dispatch(updateCourse({ id: courseId, updatedCourse }))
      .unwrap()
      .then(() => {
        navigate('/CoursesFormateur'); // Navigate back
      })
      .catch((error) => {
        console.error('Error updating course:', error);
      });

    // Generate PDF with jsPDF (optional)
    const doc = new jsPDF();
    doc.text(`Module: ${courseData.Module}`, 10, 10);
    doc.text(`courseName: ${courseData.courseName}`, 10, 20);
    doc.text(`imageUrl URL: ${courseData.imageUrl}`, 10, 30);

    if (pdfFile) {
      doc.text(`PDF Uploaded: ${pdfFile.name}`, 10, 40);
    }
  };

  return (
    <div className="w-full p-8">
      <h2 className="text-center text-2xl font-bold mb-4">Update Course</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold">Module</label>
          <input
            type="text"
            name="Module"
            value={courseData.Module}
            onChange={handleChange}
            className="w-full p-2 rounded border border-gray-300"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Title</label>
          <input
            type="text"
            name="Title"
            value={courseData.courseName}
            onChange={handleChange}
            className="w-full p-2 rounded border border-gray-300"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">imageUrl</label>
          <input
            type="text"
            name="imageUrl"
            value={courseData.imageUrl}
            onChange={handleChange}
            className="w-full p-2 rounded border border-gray-300"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Upload PDF</label>
          <input
            type="text"
            name="pdfUrl"
            value={courseData.pdfUrl}
            onChange={handleChange}
            className="w-full p-2 rounded border border-gray-300"
          />
        </div>
        {pdfPreviewData && (
          <div className="pdf-preview mt-4 border p-4">
            <embed src={pdfPreviewData} type="application/pdf" width="100%" height="400px" />
          </div>
        )}
        <button
          type="submit"
          className="bg-green-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateCourse;
