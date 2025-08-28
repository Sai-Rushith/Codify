import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { apiConnector } from "../services/apiconnector"
import { categories } from "../services/apis"
import { BsChevronDown } from "react-icons/bs"
//import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

const CourseFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const dropdownRef = useRef(null);

  // Sample categories - replace with your backend data
//   const categories = [
//     { id: 1, name: 'Web Development', count: 24 },
//     { id: 2, name: 'Mobile Development', count: 18 },
//     // { id: 3, name: 'Data Science', count: 15 },
//     // { id: 4, name: 'UI/UX Design', count: 12 },
//     // { id: 5, name: 'DevOps', count: 8 },
//     // { id: 6, name: 'Machine Learning', count: 10 },
//     // { id: 7, name: 'Cybersecurity', count: 6 },
//     // { id: 8, name: 'Cloud Computing', count: 14 }
//   ];
 
    const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        //  console.log("API Response:", res.data.allCategory) // Log the actual data
      setSubLinks(res.data.allCategory)
 
    
       
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
      setLoading(false)
    })()
  }, [])
 


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

//   const toggleCategory = (category) => {
//     setSelectedCategories(prev => {
//       const isSelected = prev.find(cat => cat.id === category.id);
//       if (isSelected) {
//         return prev.filter(cat => cat.id !== category.id);
//       } else {
//         return [...prev, category];
//       }
//     });
//   };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold mb-2 mt-16 ">Browse Courses</h1>
        <p className="text-gray-400">Discover and learn new skills with our comprehensive course catalog</p>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-6">
          {/* Filter Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg transition-colors duration-200"
            >
              <Filter className="w-4 h-4" />
              <span>Filter by Category</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-50">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-3">Course Categories</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">


                  {/* <h1>hi</h1>         
                    */}

                  <>
  {/* backend data */}
  <div className="flex w-[300px] flex-col rounded-lg bg-gray-800 p-4 text-white border border-gray-600">
    {loading ? (
      <p className="text-center text-gray-400">Loading...</p>
      
    ) : (subLinks && subLinks.length) ? (
      <>
        {subLinks
          ?.filter(
            (subLink) => subLink?.name?.length > 0
          )
          ?.map((subLink, i) => (
            <Link
              to={`/catalog/${subLink.name
                .split(" ")
                .join("-")
                .toLowerCase()}`}
              className="flex items-center justify-between p-2 hover:bg-gray-700 rounded-md transition-colors duration-200"
              key={i}
            >
              <span className="text-sm font-medium">{subLink.name}</span>
              <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
                {subLink.courses?.length || 0}
              </span>
            </Link>
          ))}
      </>
    ) : (
      <p className="text-center text-gray-400">No Courses Found</p>
    )}
  </div>
</>



                    </div>
 
  
                

  
                     

                  </div>
                </div>
        
            )}
          </div>
        </div>

        {/* Results Summary */}
        {/* <div className="text-gray-400 text-sm">
          {selectedCategories.length > 0 
            ? `Showing courses in ${selectedCategories.length} ${selectedCategories.length === 1 ? 'category' : 'categories'}`
            : 'Showing all courses'
          }
        </div> */}
      </div>
      </div>
   
  );
};

export default CourseFilter;