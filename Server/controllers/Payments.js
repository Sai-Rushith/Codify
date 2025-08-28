const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");



//capture the payment and initiate the razorpay order
exports.capturePayment = async(req,res)=>{
  
    //get courseid,userid
    const {course_id} = req.body;
    const userId = req.user.id;
    //validation
    //valid courseid
    if(!course_id){
         return res.json({
             success:false,
             message:'please provide valid course id',
         })
    };
    
    //valid coursedetails

     let course;
     try{
    course = await Course.findById(course_id);
 

         if(!course){
            return res.json({
                success:false,
                message:'could not find the course',
            });
         }

         //user already pay for the same course
       const uid = new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid)){
                return res.status(200).json({
                    success:false,
                    message:'student already enrolled',
                });
            }


     } catch(error){
           console.error(error);
           return res.status(500).json({
            success:false,
            message:error.message,
                       
           });
     }
    


   // Order create
const amount = course.price;
const currency = "INR";

const options = {
    amount: amount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
    notes: {
        courseId: course_id,
        userId,
    },
};

try {
    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);

    // Return response
    return res.status(200).json({
        success: true,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        thumbnail: course.thumbnail,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount,
    });

} catch (error) {
    console.log(error);
    res.json({
        success: false,
        message: "Something went wrong",
    });
}

 
     
};




// verify Signature of Razorpay and Server
exports.verifyPayment = async (req, res) => {
    const webhookSecret = "12345678";

    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (signature === digest) {
        console.log("Payment is Authorised");

        const { courseId, userId } = req.body.payload.payment.entity.notes;

        try {
            
             //enroll the student 
             const enrolledCourse = await Course.findOneAndUpdate(
                          {_id:courseId},
                          {
                            $push:{
                                studentsEnrolled: userId
                            }
                          },
                          {new:true},
             ); 

             if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:'course not found',
                })
             }
             console.log(enrolledCourse);
             //find the student added the course to their list enrolled courses
             const enrolledStudent = await User.findOneAndUpdate(
                        {_id:userId},
                        {$push:{courses:courseId}},
                        {new:true},
             );

             console.log(enrolledStudent);
             //mail send to the student

             const emailResponse = await mailSender(
                       enrolledStudent.email,
                       "congradulations from sai rushith ",
                       "you are enrolled in the course",
             );

             console.log(emailResponse);

             res.status(200).json({
 
                 success:true,
                 message:"Signature varified and enrolled to the course", 

             });

              


              
        } catch (error) {
            console.log(error);

            res.status(500).json({
               success:false,
               message:"error.message",

            });
        }
    }
       else{
        res.status(400).json({
            success:false,
            message:"signature not verified and invalid request",
        });
       }
 

 

};
