const Profile = require("../models/Profile");
const User = require("../models/User");

const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config()


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
