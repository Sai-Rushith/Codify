// src/components/core/Catalog/CourseFilter.jsx
import React, { useState, useRef, useEffect } from "react";
import { apiConnector } from "../services/apiconnector";
import { categories, courseEndpoints } from "../services/apis";
import { Link } from "react-router-dom";
import Course_Card from "../components/core/Catalog/Course_Card"; // adjust path if needed

const CourseFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subLinks, setSubLinks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const dropdownRef = useRef(null);

  const makeSafeName = (name = "") =>
    encodeURIComponent(
      name
        .split("/")
        .join("-")
        .split(" ")
        .join("-")
        .toLowerCase()
    );

  useEffect(() => {
    (async () => {
      setLoadingCategories(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        const list = res?.data?.data ?? res?.data?.allCategory ?? [];
        setSubLinks(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Could not fetch categories", err);
        setSubLinks([]);
      } finally {
        setLoadingCategories(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoadingCourses(true);
      try {
        const res = await apiConnector("GET", courseEndpoints.GET_ALL_COURSE_API);
        // LOG the raw response to inspect shape in Network/Console
        console.log("courses API response:", res);
        const listRaw = res?.data?.data ?? res?.data ?? [];

        // Normalize each course so UI fields exist (courseName, thumbnail, instructor, price, ratingAndReviews)
        const normalized = (Array.isArray(listRaw) ? listRaw : []).map((item) => {
          const instructor =
            item.instructor ??
            (item.instructorName ? { name: item.instructorName } : undefined) ??
            (item.instructor?.firstName ? { name: `${item.instructor.firstName} ${item.instructor.lastName ?? ""}` } : undefined);

          return {
            // prefer common names used in your cards
            _id: item._id ?? item.id ?? item.courseId,
            courseName: item.courseName ?? item.title ?? item.name ?? "",
            description: item.description ?? item.summary ?? "",
            instructor,
            price: item.price ?? item.cost ?? 0,
            thumbnail: item.thumbnail ?? item.image ?? item.cover ?? "",
            ratingAndReviews: item.ratingAndReviews ?? item.reviews ?? [],
            // keep everything else too
            ...item,
          };
        });

        setCourses(normalized);
      } catch (err) {
        console.error("Could not fetch courses", err);
        setCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    })();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-4 text-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Browse Courses</h1>
        <p className="text-gray-400">Discover and learn new skills with our catalog</p>
      </div>

      <div className="relative mb-8" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen((s) => !s)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-600 rounded-md"
        >
          Filter by Category
          <span className={`ml-2 transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
        </button>

        {isOpen && (
          <div className="absolute z-40 mt-2 w-72 bg-gray-800 border border-gray-600 rounded-md shadow-lg">
            <div className="p-3">
              <h3 className="font-semibold mb-2">Course Categories</h3>

              {loadingCategories ? (
                <div className="text-sm text-gray-400">Loading categories...</div>
              ) : subLinks.length === 0 ? (
                <div className="text-sm text-gray-400">No categories found</div>
              ) : (
                <div className="flex flex-col gap-1 max-h-64 overflow-auto">
                  {subLinks.map((cat) => {
                    const safeName = makeSafeName(cat.name);
                    return (
                      <Link
                        key={cat._id || cat.name}
                        to={`/catalog/${safeName}`}
                        className="flex items-center justify-between px-2 py-2 rounded hover:bg-gray-700"
                        onClick={() => setIsOpen(false)}
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs text-gray-300 bg-gray-700 px-2 py-1 rounded-full">
                          {cat.courses?.length ?? 0}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">All Courses</h2>

        {loadingCourses ? (
          <div className="text-gray-400">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="text-gray-400">No courses available</div>
        ) : (
          // grid: use Course_Card for each course
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Course_Card key={course._id ?? course.courseName} course={course} Height={"h-[200px]"} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseFilter;
