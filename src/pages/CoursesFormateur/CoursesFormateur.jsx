import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses, deleteCourse } from '../../features/coursesFormateur/coursesFormateurSlice'; // Adjust path if needed

const CoursesFormateur = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courses } = useSelector((state) => state.courses);

  useEffect(() => {
    // Fetch courses from the API
    dispatch(fetchCourses());
  }, [dispatch]);

  const handleUpdateCourse = (id) => {
    navigate(`/school-management-app/courses/update/${id}`);
  };

  const handleDeleteCourse = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      dispatch(deleteCourse(id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Courses List</h2>
        <button
          onClick={() => navigate('/CoursesFormateur/addCourse')}
          className="btn btn-primary"
        >
          Add Course
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Module</th>
              <th>Title</th>
              <th>Nom du formateur</th>
              <th>imageUrl</th>
              <th>videoUrl</th>
              <th>Download</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <tr key={course.id}>
                  <td>{index + 1}</td>
                  <td>{course.Module}</td>
                  <td>{course.courseName}</td>
                  <td>{course.teacherName}</td>
                  <td>
                    <img
                      src={course.imageUrl}
                      alt={course.courseName}
                      className="w-20 h-auto rounded"
                    />
                  </td>
                  <td><a href={course.videoLink} >videoUrl</a></td>
                  <td><a href={course.pdfUrl} >pdfUrl</a></td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => handleUpdateCourse(course.id)}
                      className="btn btn-info btn-sm"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="btn btn-error btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No courses available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoursesFormateur;
