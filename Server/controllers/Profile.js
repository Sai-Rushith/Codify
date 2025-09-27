const Profile = require("../models/Profile");
const User = require("../models/User");
// at top of file
//const User = require("../models/User");
const Course = require("../models/Course")
const courseProgress = require("../models/CourseProgress"); // <- important
// const convertSecondsToDuration = require("../utils/convertSecondsToDuration"); // if external


const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config()


function convertSecondsToDuration(totalSeconds = 0) {
  const sec = Number(totalSeconds) || 0;
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;

  const parts = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds || parts.length === 0) parts.push(`${seconds}s`);
  return parts.join(" ");
}

//get addtional details or update profile                --perfect

exports.updateProfile = async (req, res) => {
  try {
    // Get data from request body
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

    // Get user ID from the authenticated request
    const id = req.user.id;

    // Validation
    if (!contactNumber || !dateOfBirth || !id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Find profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    // Update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();

    // Return response
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: profileDetails,
    });
  } catch (error) {
    console.error("Error updating profile: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//delete profile                                        -- perfect

exports.deleteAccount = async (req, res) => {
 
    try{

        // Get user ID from the authenticated request
         
        const id = req.user.id;
            console.log(id);
        //  validation

        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        //  delete user profile
    await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        //delete user
        await User.findByIdAndDelete({_id:id});
        // Return response
        res.status(200).json({
            success: true,
            message: "Profile deleted successfully",
        });

        //return response

    }
    catch(error){
        console.error("Error deleting profile:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }

};

//get user details of persent logined user              -- perfect
exports.getUserDetails = async (req, res) => {
 
      try{
   const id = req.user.id;
   const userDetails = await User.findById(id).populate("additionalDetails").exec();

   return res.status(200).json({
    success:true,
    message:'user details fetched', 
    userDetails
   })

      }
      catch(error){
        console.error("Error fetching profile details:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
      }
};

//updatee profile picture                                -- perfect

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture
    console.log("hi")
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


//get enrolled courses

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec()
    userDetails = userDetails.toObject()
    var SubsectionLength = 0
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0
      SubsectionLength = 0
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        )
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length
      }
      let courseProgressCount = await courseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      })
      courseProgressCount = courseProgressCount?.completedVideos.length
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2)
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

//instructor DashBoard

exports.instructorDashboard = async (req, res) => {
  try {
    console.log('req.user =', req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }


    const courseDetails = await Course.find({ instructor: req.user.id });

    const courseData = courseDetails.map((course) => {
      // tolerate both possible spellings and missing values
      const studentsArr =
        Array.isArray(course.studentsEnroled) ? course.studentsEnroled
        : Array.isArray(course.studentsEnrolled) ? course.studentsEnrolled
        : [];

      const totalStudentsEnrolled = studentsArr.length;
      const price = Number(course.price) || 0;
      const totalAmountGenerated = totalStudentsEnrolled * price;

      return {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated,
      };
    });

    res.status(200).json({ courses: courseData });
  } catch (error) {
    // log detailed error for debugging, but don't expose stack in production
    console.error(error.stack || error);
    res.status(500).json({ message: "Server Error", error: error.message }); // remove error in production
  }
};
