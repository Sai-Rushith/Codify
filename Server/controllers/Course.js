const Course = require('../models/Course');
//const Tag = require('../models/tags');
const User = require('../models/User');
const Category = require('../models/Category')
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const SubSection = require('../models/SubSection')
const courseProgress = require('../models/CourseProgress')

// at top of controller file (temporary quick fix)
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


//create course                                      -- perfect
// exports.createCourse = async(req, res) => {
 
  
//     try{
//     //fetch data from request body
     
//     const {courseName, courseDescription, price, category, whatYouWillLearn,tag} = req.body;

//     //get thumbnail from request
//     const thumbnail = req.files.thumbnailImage;

//     //validation
//     if(!courseName || !courseDescription || !price || !category || !tag || !whatYouWillLearn || !thumbnail){
//         return res.status(400).json({
//             success: false,
//             message: "Please provide all the fields",
//         });
//     }

//     //check instructor
//     const userId = req.user.id;

//     const instructorDetails = await User.findById(userId);

//     console.log("instructor details:", instructorDetails);

//     if(!instructorDetails){

//         return res.status(404).json({
//             success: false,
//             message: "Instructor details not found",
//         });
//     }

//     //check given Category is valid or not
//     const CategoryDetails = await Category.findById(category);

//     if(!CategoryDetails){
//          return res.status(404).json({
//             success:false,
//             message:"Category details not found",
//          });
//     }


//     //upload thumbnail to cloudinary
//     const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

//     //update course details in database
     
//     const newCourse = await Course.create({
//         courseName,
//         courseDescription,
//         instructor: instructorDetails._id,
//         price,
//         tag,
//         Category: CategoryDetails._id,
//         whatYouWillLearn: whatYouWillLearn,
//         thumbnail:thumbnailImage.secure_url,
//     })

//     //add course id to instructor's courses array

//     await User.findByIdAndUpdate(
//         {_id: instructorDetails._id},
//         {
//             $push:{
//                 courses: newCourse._id,
//             }
//         },
//         {new: true},
//     );

//     //update tag's courses array
//     //hw
//     // await Tag.findByIdAndUpdate(
//     //     {_id: tagDetails._id},
//     //     {
//     //         $push: {
//     //             courses: newCourse._id,
//     //         }
//     //     },
//     //     {new: true}
//     // )
     
//     //return response
//     return res.status(201).json({
//         success: true,
//         message: "Course created successfully",
//         course: newCourse,
//     });


//     }
//     catch(error){
//         console.error("Error creating course:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error",
//         });
//     }

// }

exports.createCourse = async (req, res) => {
	try {
		// Get user ID from request object
		const userId = req.user.id;

		// Get all required fields from request body
		let {
			courseName,
			courseDescription,
			whatYouWillLearn,
			price,
			tag,
			category,
			status,
			instructions,
		} = req.body;

		// Get thumbnail image from request files
		const thumbnail = req.files.thumbnailImage;

		// Check if any of the required fields are missing
		if (
			!courseName ||
			!courseDescription ||
			!whatYouWillLearn ||
			!price ||
			!tag ||
			!thumbnail ||
			!category
		) {
			return res.status(400).json({
				success: false,
				message: "All Fields are Mandatory",
			});
		}
		if (!status || status === undefined) {
			status = "Draft";
		}
		// Check if the user is an instructor
		const instructorDetails = await User.findById(userId, {
			accountType: "Instructor",
		});

		if (!instructorDetails) {
			return res.status(404).json({
				success: false,
				message: "Instructor Details Not Found",
			});
		}

		// Check if the tag given is valid
		const categoryDetails = await Category.findById(category);
		if (!categoryDetails) {
			return res.status(404).json({
				success: false,
				message: "Category Details Not Found",
			});
		}
		// Upload the Thumbnail to Cloudinary
		const thumbnailImage = await uploadImageToCloudinary(
			thumbnail,
			process.env.FOLDER_NAME
		);
		console.log(thumbnailImage);
		// Create a new course with the given details
		const newCourse = await Course.create({
			courseName,
			courseDescription,
			instructor: instructorDetails._id,
			whatYouWillLearn: whatYouWillLearn,
			price,
			tag: tag,
			category: categoryDetails._id,
			thumbnail: thumbnailImage.secure_url,
			status: status,
			instructions: instructions,
		});

		// Add the new course to the User Schema of the Instructor
		await User.findByIdAndUpdate(
			{
				_id: instructorDetails._id,
			},
			{
				$push: {
					courses: newCourse._id,
				},
			},
			{ new: true }
		);
		// Add the new course to the Categories
		await Category.findByIdAndUpdate(
			{ _id: category },
			{
				$push: {
					course: newCourse._id,
				},
			},
			{ new: true }
		);
		// Return the new course and a success message
		res.status(200).json({
			success: true,
			data: newCourse,
			message: "Course Created Successfully",
		});
	} catch (error) {
		// Handle any errors that occur during the creation of the course
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to create course",
			error: error.message,
		});
	}
};



//gell all courses                                    --perfect



// controllers/courseController.js
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      { status: "Published" },                        // <-- filter for published
      {
        courseName: 1,
        courseDescription: 1,
        price: 1,
        Category: 1,
        thumbnail: 1,
        instructor: 1,
        StudentsEnrolled: 1,
        ratingAndReviews: 1,
        status: 1,
      }
    )
      .populate("instructor")
      .lean()
      .exec();

    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


//get course details                                  -- perfect

exports.getCourseDetails = async (req, res) => {
  try {
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
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl",
        },
      })
      .exec()

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

//edit courses  


//Edit Course Details
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ success: false, message: "courseId is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // ---------- thumbnail upload (handle single/array/middleware shapes) ----------
    if (req.files && (req.files.thumbnailImage || req.files.thumbnail)) {
      console.log("thumbnail update");
      let thumb = req.files.thumbnailImage || req.files.thumbnail;
      if (Array.isArray(thumb)) thumb = thumb[0];
      if (thumb) {
        const thumbnailImage = await uploadImageToCloudinary(thumb, process.env.FOLDER_NAME);
        course.thumbnail = thumbnailImage.secure_url;
      }
    }

    // ---------- safe copy of incoming fields ----------
    const updates = { ...req.body };
    delete updates.courseId;
    delete updates._id;
    delete updates.thumbnailImage;
    delete updates.thumbnail;

    // ---------- normalize status/state to the exact canonical strings used in frontend ----------
    // Frontend constants: { DRAFT: "Draft", PUBLISHED: "Published" }
    const schemaField = Object.prototype.hasOwnProperty.call(course.toObject(), "status")
      ? "status"
      : Object.prototype.hasOwnProperty.call(course.toObject(), "state")
      ? "state"
      : "status";

    const rawStatus = updates.status ?? updates.state;
    if (rawStatus !== undefined) {
      const normalized = String(rawStatus).trim().toLowerCase();
      const map = {
        published: "Published",
        public: "Published",
        publish: "Published",
        draft: "Draft",
      };
      const mapped = map[normalized] ?? String(rawStatus).trim();

      const allowed = ["Draft", "Published"];
      if (!allowed.includes(mapped)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status value. Allowed values: ${allowed.join(", ")}`,
        });
      }

      course[schemaField] = mapped;
      delete updates.status;
      delete updates.state;
    }

    // ---------- apply other updates safely ----------
    for (const [key, rawValue] of Object.entries(updates)) {
      if (rawValue === undefined) continue;

      // parse JSON fields only when they're strings
      if (key === "tag" || key === "instructions") {
        if (typeof rawValue === "string") {
          try {
            course[key] = JSON.parse(rawValue);
          } catch (err) {
            return res.status(400).json({
              success: false,
              message: `${key} must be valid JSON`,
              error: err.message,
            });
          }
        } else {
          course[key] = rawValue;
        }
        continue;
      }

      // convert "true"/"false" strings to booleans (FormData quirk)
      if (typeof rawValue === "string") {
        const lv = rawValue.trim().toLowerCase();
        if (lv === "true" || lv === "false") {
          course[key] = lv === "true";
          continue;
        }
      }

      // avoid setting protected fields by accident (you can extend this list)
      if (["_id", "createdAt", "updatedAt"].includes(key)) continue;

      course[key] = rawValue;
    }

    // ---------- save and handle mongoose validation errors ----------
    try {
      await course.save();
    } catch (err) {
      if (err.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          error: err.message,
          details: err.errors,
        });
      }
      throw err;
    }
     
	  await course.save()
  
	  const updatedCourse = await Course.findOne({
		_id: courseId,
	  })
		.populate({
		  path: "instructor",
		  populate: {
			path: "additionalDetails",
		  },
		})
		// .populate("category")
		//.populate("ratingAndReviews")
		.populate({
		  path: "courseContent",
		  populate: {
			path: "subSection",
		  },
		})
		.exec()
  

    return res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("editCourse error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// Function to get all courses of a particular instructor
exports.getInstructorCourses = async (req, res) => {
	try {
		// Get user ID from request object
		const userId = req.user.id;

		// Find all courses of the instructor
		const allCourses = await Course.find({ instructor: userId });

		// Return all courses of the instructor
		res.status(200).json({
			success: true,
			data: allCourses,
		});
	} catch (error) {
		// Handle any errors that occur during the fetching of the courses
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch courses",
			error: error.message,
		});
	}
}



  //get full course details
  exports.getFullCourseDetails = async (req, res) => {
	try {
	  const { courseId } = req.body
	  const userId = req.user.id
	  const courseDetails = await Course.findOne({
		_id: courseId,
	  })
		.populate({
		  path: "instructor",
		  populate: {
			path: "additionalDetails",
		  },
		})
		.populate("category")
		.populate("ratingAndReviews")
		.populate({
		  path: "courseContent",
		  populate: {
			path: "subSection",
		  },
		})
		.exec()

		
	  let courseProgressCount = await courseProgress.findOne({
		courseID: courseId,
		userID: userId,
	  })
  
	  console.log("courseProgressCount : ", courseProgressCount)
  
	  if (!courseDetails) {
		return res.status(400).json({
		  success: false,
		  message: `Could not find course with id: ${courseId}`,
		})
	  }
  
	  // if (courseDetails.status === "Draft") {
	  //   return res.status(403).json({
	  //     success: false,
	  //     message: `Accessing a draft course is forbidden`,
	  //   });
	  // }
  
	  let totalDurationInSeconds = 0
	  courseDetails.courseContent.forEach((content) => {
		content.subSection.forEach((subSection) => {
		  const timeDurationInSeconds = parseInt(subSection.timeDuration)
		  totalDurationInSeconds += timeDurationInSeconds;
		})
	  })
  
	  const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
	  return res.status(200).json({
		success: true,
		data: {
		  courseDetails,
		  totalDuration,
		  completedVideos: courseProgressCount?.completedVideos
			? courseProgressCount?.completedVideos
			: ["none"],
		},
	  })
	} catch (error) {
	  return res.status(500).json({
		success: false,
		message: error.message,
	  })
	}
  }

  //delete course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    // const studentsEnrolled = course.studentsEnroled
    // for (const studentId of studentsEnrolled) {
    //   await User.findByIdAndUpdate(studentId, {
    //     $pull: { courses: courseId },
    //   })
    // }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}
