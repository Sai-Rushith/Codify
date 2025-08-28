//const Tag = require('../models/tags');
const Category = require("../models/Category");



//create like python,ai/ml etc ,etc                       -- perfect
exports.createCategory = async (req,res) =>{
  try{
 
     const {name, description} = req.body;
     //validation

     if(!name || !description){
       return res.status(400).json({
         success: false,
         message: "Please provide all the fields",
       });
     }

     //create entry in database

     const CategoryDetails = await Category.create({
        name: name,
        description: description,
     });

     console.log("tag details:", CategoryDetails);

        //return response
        res.status(201).json({
            success: true,
            message: "Category created successfully",
          
            });
  }
  catch(error){
    console.error("Error creating Category:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
     
    });
  }
      
 
     
};


//get all tags                                               -- perfect

exports.showAllCategories = async (req, res) => {

  try{
   const allCategory = await Category.find({},{name:true, description:true});
    console.log("all Categories:", allCategory);
//return response
    res.status(200).json({
      success: true,
      message: "Tags fetched successfully",
        allCategory,
    });

  }
  catch(error){
    console.error("Error fetching tags:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }


};



//categoryPageDetails                                       --HW

exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
      console.log("PRINTING CATEGORY ID: ", categoryId);
      // Get courses for the specified category
      const selectedCategory = await Category.findById(categoryId)
        .populate("courses")
        .exec()
  
      //console.log("SELECTED COURSE", selectedCategory)
      // Handle the case when the category is not found
      if (!selectedCategory) {
        console.log("Category not found.")
        return res.status(404)
          .json({ success: false, message: "Category not found" })
      }
      // // Handle the case when there are no courses
      // if (selectedCategory.courses.length === 0) {
      //   console.log("No courses found for the selected category.")
      //   return res.status(404).json({
      //     success: false,
      //     message: "No courses found for the selected category.",
      //   })
      // }
  
      // // Get courses for other categories
      // const categoriesExceptSelected = await Category.find({
      //   _id: { $ne: categoryId },
      // })
      const differentCategory = await Category.findOne({
        _id:{$ne:categoryId},
      }
      )
        .populate("courses")
        .exec()
        //console.log("Different COURSE", differentCategory)


      // Get top-selling courses across all categories

      // const allCategories = await Category.find()
      //   .populate({
      //     path: "courses",
      //     match: { status: "Published" },
      //     populate: {
      //       path: "instructor",
      //   },
      //   })
      //   .exec()
      // const allCourses = allCategories.flatMap((category) => category.courses)
      // const mostSellingCourses = allCourses
      //   .sort((a, b) => b.sold - a.sold)
      //   .slice(0, 10)
      //  // console.log("mostSellingCourses COURSE", mostSellingCourses)


      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
         // mostSellingCourses,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }