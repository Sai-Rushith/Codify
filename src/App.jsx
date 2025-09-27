import {Routes,Route} from "react-router-dom";
import Home from "./pages/Home"
import Navbar from "./components/common/Navbar"
import CourseFilter from "./pages/Courses"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Forgotpassword from "./pages/ForgotPassword"
import UpdatePassword from "./pages/UpdatePassword"
import VerifyEmail from "./pages/VerifyEmail"
import AboutUs from "./pages/AboutUs"
import Terms from "./pages/Terms"
import Footer from "./components/common/Footer"
import Privacy from "./pages/Privacy"
import ContactUs from "./pages/ContactUs"
import Dashboard from "./pages/Dashboard"
import MyProfile from "./components/core/Dashboard/MyProfile"
import PrivateRoute from "./components/core/Auth/PrivateRoute"
import Settings from "./components/core/Dashboard/Settings/index"
import { ACCOUNT_TYPE } from "./util/constants";
import AddCourse from "./components/core/Dashboard/AddCourse";
import {  useSelector } from "react-redux";

import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";

import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails"

import Cart from "./components/core/Dashboard/Cart";

import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses"

import ViewCourse from "./pages/ViewCourse"
import VideoDetails from "./components/core/ViewCourse/VideoDetails"

import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";

function App() {
    
    
  const { user } = useSelector((state) => state.profile)
   
  return (
   <div>
    <Navbar/>
 <Routes>
 
 <Route path="/" element ={<Home/>}/>
  <Route path="catalog/*" element={<Catalog/>} />
 <Route path="/catalog" element = {<CourseFilter/>}/>
 <Route path="/login" element = {<Login/>}/>
 <Route path="/signup" element = {<Signup/>}/>
 <Route path="/forgot-password" element = {<Forgotpassword/>}/> 
 <Route path="/update-password/:id" element = {<UpdatePassword/>}/>
 <Route path="/verify-email" element = {<VerifyEmail/>}/>
 <Route path="/about" element = {<AboutUs/>}/>
 <Route path="/terms" element = {<Terms/>}/>
 <Route path="/privacy" element = {<Privacy/>}/>
 <Route path="/contact" element = {<ContactUs/>}/>
 <Route path="courses/:courseId" element = {<CourseDetails/>}/>
 {/* <Route path="/dashboard/my-profile" element={<Dashboard/>}/> */}
 
 
    <Route 
      element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      }
    >
      <Route path="dashboard/my-profile" element={<MyProfile />} />
      
      <Route path="dashboard/Settings" element={<Settings />} />
      

      {
        user?.accountType === ACCOUNT_TYPE.STUDENT && (
          <>
          <Route path="dashboard/cart" element={<Cart />} />
          <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
          </>
        )
      }

      {
        user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
          <>
          <Route path="dashboard/dashboard" element={<Instructor />} />
          <Route path="dashboard/add-course" element={<AddCourse />} />
          <Route path="dashboard/my-course" element={<MyCourses />} />
          <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />
          
          </>
        )
      }


    </Route>
// AppRoutes (or wherever you define routes)
<Route
  path="view-course/:courseId"
  element={
    <PrivateRoute>
      <ViewCourse />
    </PrivateRoute>
  }
>
  {user?.accountType === ACCOUNT_TYPE.STUDENT && (
    <Route
      path="section/:sectionId/sub-section/:subSectionId"
      element={<VideoDetails />}
    />
  )}
</Route>



 </Routes>
    <Footer/>

   </div>
   
  );
}

export default App;
