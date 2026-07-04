import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const getProfile = async (req, res) => {
  res.status(200).json(req.user);
};

const updateProfile = async (req, res) => {
  const { name, phone } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = name || user.name;
  user.phone = phone || user.phone;

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    role: updatedUser.role,
    resume: updatedUser.resume,
  });
};




const uploadResume = async (req, res) => {
  if (req.user.role !== "student") {
    res.status(403);
    throw new Error("Only students can upload resume");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("Please upload a resume file");
  }

  const user = await User.findById(req.user._id);

  user.resume = req.file.path;

  const updatedUser = await user.save();

  res.status(200).json({
    message: "Resume uploaded successfully",
    resume: updatedUser.resume,
  });
};




// const uploadResume = async (req, res) => {
//   if (req.user.role !== "student") {
//     res.status(403);
//     throw new Error("Only students can upload resume");
//   }

//   if (!req.file) {
//     res.status(400);
//     throw new Error("Please upload a resume file");
//   }


//   console.log({
//   cloud: process.env.CLOUDINARY_CLOUD_NAME,
//   key: process.env.CLOUDINARY_API_KEY,
//   secretExists: !!process.env.CLOUDINARY_API_SECRET,
// });

//   const result = await cloudinary.uploader.upload(req.file.path, {
//     folder: "CareerConnect/uploads/resumes",
//     resource_type: "raw",
//   });

//   const user = await User.findById(req.user._id);
//   user.resume = result.secure_url;

//   const updatedUser = await user.save();

//   res.status(200).json({
//     message: "Resume uploaded successfully",
//     resume: updatedUser.resume,
//   });
// };


// const uploadResume = async (req, res) => {
//   try {
//     const result = await cloudinary.api.ping();
//     console.log("PING RESULT:", result);
//     return res.json(result);
//   } catch (err) {
//     console.log("PING ERROR:", err);
//     return res.status(500).json({
//       message: err.message,
//       error: err,
//     });
//   }
// };




// const uploadResume = async (req, res) => {
//   if (req.user.role !== "student") {
//     res.status(403);
//     throw new Error("Only students can upload resume");
//   }

//   if (!req.file) {
//     res.status(400);
//     throw new Error("Please upload a resume file");
//   }

//   const result = await cloudinary.uploader.upload(req.file.path, {
//     folder: "CareerConnect/uploads/resumes",
//     resource_type: "raw",
//     type: "upload",
//     access_mode: "public",
//   });

//   const user = await User.findById(req.user._id);
//   user.resume = result.secure_url;

//   const updatedUser = await user.save();

//   res.status(200).json({
//     message: "Resume uploaded successfully",
//     resume: updatedUser.resume,
//   });
// };



// const uploadResume = async (req, res) => {
//   if (req.user.role !== "student") {
//     res.status(403);
//     throw new Error("Only students can upload resume");
//   }

//   if (!req.file) {
//     res.status(400);
//     throw new Error("Please upload a resume file");
//   }

//   const uploadToCloudinary = () => {
//     return new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         {
//           folder: "careerconnect/resumes",
//           resource_type: "raw",
//         },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         }
//       );

//       streamifier.createReadStream(req.file.buffer).pipe(stream);
//     });
//   };

//   const result = await uploadToCloudinary();

//   const user = await User.findById(req.user._id);
//   user.resume = result.secure_url;

//   const updatedUser = await user.save();

//   res.status(200).json({
//     message: "Resume uploaded successfully",
//     resume: updatedUser.resume,
//   });
// };


const userController = { getProfile, updateProfile , uploadResume };

export default userController;