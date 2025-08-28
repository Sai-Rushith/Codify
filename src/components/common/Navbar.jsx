import { Link, useLocation } from "react-router-dom"
import { Button } from "../ui/Button"
import {useSelector} from "react-redux"
import ProfileDropdown from "../core/Auth/ProfileDropDown"
// import { apiConnector } from "../../services/apiconnector"
// import { categories } from "../../services/apis"
// import { useEffect, useState } from "react"

function Navbar() {

  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
 // const { totalItems } = useSelector((state) => state.cart)   
  const location = useLocation()

// const [subLinks, setSubLinks] = useState([])
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     ;(async () => {
//       setLoading(true)
//       try {
//         const res = await apiConnector("GET", categories.CATEGORIES_API)
//         setSubLinks(res.data.data)
//       } catch (error) {
//         console.log("Could not fetch Categories.", error)
//       }
//       setLoading(false)
//     })()
//   }, [])

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-black/50">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-kn1C5CDk5zUaYa4BHkG1FKUQupEsrm.png"
              alt="Crop Studio"
              className="w-8 h-8"
            />
            <span className="font-large text-white text-2xl">CODIFY</span>
          </Link>
        </div>
        <nav className="hidden md:flex ml-10">
          <div className="flex items-center gap-1 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-full px-6 py-3">
              <Link
              to="/"
              className={`text-sm transition-colors px-4 py-1 rounded-full hover:bg-white/10 ${
                isActive("/") ? "text-white bg-white/10" : "text-white hover:text-gray-300"
              }`}
            >
             Home
            </Link>
            
            <Link
              to="/catalog"
              className={`text-sm transition-colors px-4 py-1 rounded-full hover:bg-white/10 ${
                isActive("/catalog") ? "text-white bg-white/10" : "text-white hover:text-gray-300"
              }`}
            >
              Course
            </Link>
            <Link
              to="/about"
              className={`text-sm transition-colors px-4 py-1 rounded-full hover:bg-white/10 ${
                isActive("/about") ? "text-white bg-white/10" : "text-white hover:text-gray-300"
              }`}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className={`text-sm transition-colors px-4 py-1 rounded-full hover:bg-white/10 ${
                isActive("/contact") ? "text-white bg-white/10" : "text-white hover:text-gray-300"
              }`}
            >
              Contact Us
            </Link>
          </div>
        </nav>

  {/* login/signup/dashboard */}
   
     <div className="flex items-center gap-3">
       
       { 
        user && user?.accountType !=="Instructor" && (
             <Link to="/cart">
          <Button variant="secondary" className="bg-white text-black hover:bg-gray-100">
            Cart
          </Button>
        </Link>
         
        )
         
       }
         
      {
        token === null && (
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="secondary" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 px-6 py-2 font-medium">
                Log in
              </Button>
            </Link>
            
            <Link to="/signup">
              <Button variant="secondary" className="bg-white text-black hover:bg-gray-100">
                Sign Up
              </Button>
            </Link>
          </div>
        )
      }

       {    
        token !== null && <ProfileDropdown/>
       }
          
     </div>
      

      
      </div>
    </header>
  )
}

export default Navbar