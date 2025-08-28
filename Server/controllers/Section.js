const Section = require('../models/Section');
const SubSection = require('../models/SubSection');
const Course = require('../models/Course');


//create section                                    --perfect
exports.createSection = async (req,res) =>{
  try{
 
  //data fetching from request body

  const {sectionName, courseId} = req.body;
  
  //validation
    if(!sectionName || !courseId){
        return res.status(400).json({
        success: false,
        message: "Please provide all the fields",
        });
    }


  //create Section
const newSection = await Section.create({sectionName});
  //update course with section objectid
  const updatedCourseDetails = await Course.findByIdAndUpdate(
    courseId,
    { $push: { courseContent: newSection._id } },
    { new: true }
  )
  .populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();

  //hw:use populate to replace sections/subsections both in the updatedCourseDetails



  //return response

    res.status(201).json({
        success: true,
        message: "Section created successfully",
        data: {
       course: updatedCourseDetails,
        },
    });
 
      

  } 
  catch(error){
    console.error("Error creating section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }  
     
}

//update section                                     -- perfect
exports.updateSection = async (req, res) => {

 try{

    //data input from request body
    const { sectionId, sectionName } = req.body;


    //data validation
    if (!sectionId || !sectionName) {
        return res.status(400).json({
            success: false,
            message: "Please provide all the fields",
        });
    }

    //update section
    const section = await Section.findByIdAndUpdate(
        sectionId,
        {   sectionName },
        { new: true }
    );

    //return response

    return res.status(200).json({
        success: true,
        message: "Section updated successfully",
       // data: section,
    });

 }
    catch(error){
        console.error("Error updating section:", error);
        res.status(500).json({
        success: false,
        message: "Internal server error",
        });
    }
   
     
}

//delete section                                       -- perfect
exports.deleteSection = async (req, res) => {
	try {

		const { sectionId, courseId }  = req.body;
		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
		const section = await Section.findById(sectionId);
		console.log(sectionId, courseId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();

		res.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});
	} catch (error) {
		console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};   