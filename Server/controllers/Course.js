const Course = require('../models/Course');
//const Tag = require('../models/tags');
const User = require('../models/User');
const Category = require('../models/Category')
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const SubSection = require('../models/SubSection')


//create course                                      -- perfect
exports.createCourse = async(req, res) => {
 
  
    try{
    //fetch data from request body
     
    const {courseName, courseDescription, price, category, whatYouWillLearn,tag} = req.body;

    //get thumbnail from request
    const thumbnail = req.files.thumbnailImage;

    //validation
    if(!courseName || !courseDescription || !price || !category || !tag || !whatYouWillLearn || !thumbnail){
        return res.status(400).json({
            success: false,
            message: "Please provide all the fields",
        });
    }

    //check instructor
    const userId = req.user.id;

    const instructorDetails = await User.findById(userId);

    console.log("instructor details:", instructorDetails);

    if(!instructorDetails){

        return res.status(404).json({
            success: false,
            message: "Instructor details not found",
        });
    }

    //check given Category is valid or not
    const CategoryDetails = await Category.findById(category);

    if(!CategoryDetails){
         return res.status(404).json({
            success:false,
            message:"Category details not found",
         });
    }


    //upload thumbnail to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

    //update course details in database
     
    const newCourse = await Course.create({
        courseName,
        courseDescription,
        instructor: instructorDetails._id,
        price,
        tag,
        Category: CategoryDetails._id,
        whatYouWillLearn: whatYouWillLearn,
        thumbnail:thumbnailImage.secure_url,
    })

    //add course id to instructor's courses array

    await User.findByIdAndUpdate(
        {_id: instructorDetails._id},
        {
            $push:{
                courses: newCourse._id,
            }
        },
        {new: true},
    );

    //update tag's courses array
    //hw
    // await Tag.findByIdAndUpdate(
    //     {_id: tagDetails._id},
    //     {
    //         $push: {
    //             courses: newCourse._id,
    //         }
    //     },
    //     {new: true}
    // )
     
    //return response
    return res.status(201).json({
        success: true,
        message: "Course created successfully",
        course: newCourse,
    });


    }
    catch(error){
        console.error("Error creating course:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }

}


//gell all courses                                    --perfect



exports.getAllCourses = async (req, res) => {

try{
 
const allCourses = await Course.find({},{ 
    courseName: true, 
    courseDescription: true,
    price: true,
    Category: true,
    thumbnail: true,
    instructor: true,
    StudentsEnrolled: true,
    ratingAndReviews: true,
         }).populate("instructor").exec();
  
         return res.status(200).json({
    success: true,
    message: "Courses fetched successfully",
    data:allCourses,
});
 

}catch(error){
    console.error("Error fetching courses:", error);
    return res.status(500).json({
        success: false,
        message: "Internal server error",
    });
}

}


//get course details                                  -- perfect

exports.getCourseDetails = async(req,res)=>{
    

    try{
    const { courseId } = req.body
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("Category")
   //   .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          //select: "-videoUrl",
        },
      })
      .exec()

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    //return response

    return res.status(400).json({
         
        success:true,
        message:'course details fetched',
        courseDetails,

    });


         
        
           
          
    } 
   catch(error){
    console.error("Error fetching courses:", error);
    return res.status(500).json({
        success: false,
        message: "Internal server error",
    });
}
    
 
     
};