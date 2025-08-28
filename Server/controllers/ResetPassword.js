
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

//resetpassword token                                    -- perfect

exports.resetPasswordToken = async (req, res) => {

try{


    //get email from request body
const { email } = req.body;

//check if user exists with that email
  const user = await User.findOne({ email:email });
if (!user) {
    return res.status(404).json({
        success: false,
        message: 'User not found with this email',
    });
}
//generate token


  const token = crypto.randomUUID(); // or use any other method to generate a unique token

//update user by adding token and expiration time
const updatedDetails = await User.findOneAndUpdate(
    { email: email },
    {
        token: token,
        resetPasswordExpires: Date.now() + 36000000, // 10 hour from now
    },
    { new: true }
);


//create  url

const url = `http://localhost:3000/update-password/${token}`;
//send mail containing the url

await mailSender(
    email,
    "Reset Password",
    `Click on the link to reset your password: ${url}`
);


//return response
return res.status(200).json({
    success: true,
    message: 'Reset password link sent to your email',
   
});


}
catch(error){
    console.log("error in resetPasswordToken:", error);
    return res.status(500).json({
        success: false,
        message: "Internal server error while generating reset password token",
    });


}

}


//resetpassword                                          -- perfect

exports.resetPassword = async (req, res) => {

try{

    
    //data fetching

    const {token,password,confirmPassword} = req.body;
    //validation

    if(!token || !password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields',
        });
    }

    if(password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Passwords do not match',
        });
    }


//get user details from db by  token

const userDetails = await User.findOne({ token: token});

//if no entry found invalid token

if(!userDetails) {
    return res.status(404).json({
        success: false,
        message: 'Invalid token',
    });
}

//token timeout check

if(userDetails.resetPasswordExpires < Date.now()) {
    return res.status(400).json({
        success: false,
        message: 'Token has expired, please request a new one',
    });
}

//hash password

const hashedPassword = await bcrypt.hash(password, 10);


//update user password

await User.findOneAndUpdate(
    { token: token },
    {
        password: hashedPassword,
       
    },
    { new: true }
);   
 
 
return res.status(200).json({
    success: true,
    message: 'Password has been reset successfully',
});



 

}
catch(error){
    console.log("error in resetPassword:", error);
    return res.status(500).json({
        success: false,
        message: "Internal server error while resetting password",
    });
}

}