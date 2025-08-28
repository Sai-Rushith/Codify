const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
// Configuring dotenv to load environment variables from .env file
dotenv.config();

//auth
exports.auth = async (req, res, next) => {
	try {
		// Extracting JWT from request cookies, body or header
         console.log("cookies.token:", req.cookies?.token);
console.log("body.token:", req.body?.token);
console.log("header Authorization:", req.header("Authorization"));
console.log("Token expires at:", new Date(1756408877 * 1000));

		const token =
			req.cookies?.token ||
			req.body?.token ||
			req.header("Authorization")?.replace("Bearer ", "");

            console.log("token",token);
		// If JWT is missing, return 401 Unauthorized response
		if (!token) {
			return res.status(401).json({ success: false, message: `Token Missing` });
		}
          
		try {
			// Verifying the JWT using the secret key stored in environment variables
           
			const decode = await jwt.verify(token, process.env.JWT_SECRET);
			console.log(decode);
			// Storing the decoded JWT payload in the request object for further use
			req.user = decode;
		} catch (error) {
			// If JWT verification fails, return 401 Unauthorized response
			return res
				.status(401)
				.json({ success: false, message: "token is invalid" });
		}

		// If JWT is valid, move on to the next middleware or request handler
		next();
	} catch (error) {
		// If there is an error during the authentication process, return 401 Unauthorized response
		return res.status(401).json({
			success: false,
			message: `Something Went Wrong While Validating the Token`,
		});
	}
};

//isStudent

exports.isStudent = async (req, res, next) => {
 
 
     try{ 
         
          if(req.user.accountType !== "Student") {
            return res.status(403).json({
                success: false,
                message: "Access denied. You are not a student.",
            });

        }

        next(); 
      
          
          

     }
     catch(error){
         console.log("error in isStudent middleware:", error);
         return res.status(500).json({
             success: false,
             message: "Internal server error",
         });
     }
       
     
      
      
}


//isInstructor

exports.isInstructor = async (req, res, next) => {
 
 
     try{ 
         
          if(req.user.accountType !== "Instructor") {
            return res.status(403).json({
                success: false,
                message: "Access denied. You are not a Instructor.",
            });

        }

        next(); 
      
          
          

     }
     catch(error){
         console.log("error in isInstructor middleware:", error);
         return res.status(500).json({
             success: false,
             message: "Internal server error",
         });
     }
       
     
      
      
}


//isAdmin

exports.isAdmin = async (req, res, next) => {
 
 
     try{ 
         
          if(req.user.accountType !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. You are not a isAdmin.",
            });

        }

        next(); 
      
          
          

     }
     catch(error){
         console.log("error in isAdmin middleware:", error);
         return res.status(500).json({
             success: false,
             message: "Internal server error",
         });
     }
       
     
      
      
}



  
 
