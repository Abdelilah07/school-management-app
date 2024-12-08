import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { updateCourse, fetchCourses } from '../../features/coursesFormateur/coursesFormateurSlice';

const UpdateCourse = () => {
  const { courseId } = useParams(); // Match courseId from route params
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { courses, status } = useSelector((state) => state.courses);

  const [courseData, setCourseData] = useState({
    Module: '',
    courseName: '',
    teacherName:'',
    teacherId:'',
    courseDescription:'',
    videoLink: '',
    imageUrl: '',
    pdfUrl: null,
  });
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
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
    
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedCourse = {
      ...courseData,
      id: courseId, // Ensure the course ID is sent
      Module: courseData.Module,
      pdfUrl: courseData.pdfUrl, // File name or existing value
    };

    dispatch(updateCourse({ id: courseId, updatedCourse }))
      .unwrap()
      .then(() => {
        navigate('/courses'); // Navigate back
      })
      .catch((error) => {
        console.error('Error updating course:', error);
      });
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
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Title</label>
          <input
            type="text"
            name="courseName"
            value={courseData.courseName}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Enter Course ID"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">ID du formateur</label>
          <input
            type="text"
            name="teacherId"
            value={courseData.teacherId}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Enter Course ID"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Nom du formateur</label>
          <input
            type="text"
            name="teacherName"
            value={courseData.teacherName}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Enter Teacher Name"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Course description</label>
          <input
            type="text"
            name="courseDescription"
            value={courseData.courseDescription}
            onChange={handleChange}
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
            value={courseData.videoLink}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={courseData.imageUrl}
            onChange={handleChange}
            className="input input-bordered w-full"
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
            className="input input-bordered w-full"
            placeholder="Enter the pdf link"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateCourse;
