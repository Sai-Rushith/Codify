import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import { getInstructorData } from '../../../../services/operations/profileAPI';
import InstructorChart from './InstructorChart';
import { Link } from 'react-router-dom';

export default function Instructor() {
    const { token } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.profile)
    const [loading, setLoading] = useState(false)
    const [instructorData, setInstructorData] = useState(null)
    const [courses, setCourses] = useState([])
  
    useEffect(() => {
      ;(async () => {
        setLoading(true)
        const instructorApiData = await getInstructorData(token)
        const result = await fetchInstructorCourses(token)
        console.log(instructorApiData)
        if (instructorApiData?.length) setInstructorData(instructorApiData)
        if (result) {
          setCourses(result)
        }
        setLoading(false)
      })()
    }, [])
  
    const totalAmount = instructorData?.reduce(
      (acc, curr) => acc + curr.totalAmountGenerated,
      0
    )
  
    const totalStudents = instructorData?.reduce(
      (acc, curr) => acc + curr.totalStudentsEnrolled,
      0
    )
  
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-6 mb-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight">
                Hi {user?.firstName} <span className="inline-block">👋</span>
              </h1>
              <p className="text-sm text-gray-300">Let's start something new</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/dashboard/add-course" className="inline-block">
                <button className="rounded-md bg-white text-black px-4 py-2 font-semibold shadow-md hover:opacity-95">
                  Create Course
                </button>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-12 w-12 rounded-full border-4 border-white border-t-transparent animate-spin" />
            </div>
          ) : courses?.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Chart / Visual */}
                <div className="lg:col-span-2 bg-white text-black rounded-xl shadow-lg p-6 flex flex-col justify-between">
                  {totalAmount > 0 || totalStudents > 0 ? (
                    <div className="h-full">
                      <p className="text-lg font-semibold mb-4">Visualize</p>
                 {/* Replace this previous wrapper with the scrollable one */}
<div className="max-h-[220px] md:max-h-[260px] lg:max-h-[320px] rounded-md overflow-auto">
  {/* inner padding so scrollbar doesn't touch the edges */}
  <div className="p-2">
    <InstructorChart courses={instructorData} />
  </div>
</div>


                    </div>
                  ) : (
                    <div className="flex h-[320px] items-center justify-center">
                      <div className="text-center">
                        <p className="text-xl font-semibold">Not Enough Data To Visualize</p>
                        <p className="text-sm text-gray-600 mt-2">Create courses and get enrollments to see analytics</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Statistics */}
                <div className="bg-white text-black rounded-xl shadow-lg p-6 flex flex-col">
                  <p className="text-lg font-semibold">Statistics</p>
                  <div className="mt-6 space-y-6">
                    <div className="flex flex-col">
                      <p className="text-sm text-gray-600">Total Courses</p>
                      <p className="text-3xl font-bold">{courses?.length}</p>
                    </div>

                    <div className="flex flex-col">
                      <p className="text-sm text-gray-600">Total Students</p>
                      <p className="text-3xl font-bold">{totalStudents || 0}</p>
                    </div>

                    <div className="flex flex-col">
                      <p className="text-sm text-gray-600">Total Income</p>
                      <p className="text-3xl font-bold">Rs. {totalAmount || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Your Courses */}
              <div className="bg-white text-black rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">Your Courses</p>
                  <Link to="/dashboard/my-courses" className="text-sm font-medium text-gray-700 hover:underline">View All</Link>
                </div>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {courses.slice(0, 3).map((course) => (
                    <div key={course._id} className="rounded-lg overflow-hidden border border-gray-200">
                      <div className="h-48 w-full bg-gray-100 overflow-hidden">
                        <img
                          src={course.thumbnail}
                          alt={course.courseName}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="p-4">
                        <p className="text-sm font-medium truncate">{course.courseName}</p>
                        <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                          <div>{course?.studentsEnroled?.length || 0} students</div>
                          <div>Rs. {course.price || 0}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-20 rounded-xl bg-white text-black p-12 text-center shadow-md">
              <p className="text-2xl font-bold">You have not created any courses yet</p>
              <Link to="/dashboard/add-course">
                <p className="mt-4 inline-block rounded-md bg-black text-white px-4 py-2 font-semibold">Create a course</p>
              </Link>
            </div>
          )}
        </div>
      </div>
    )
  }