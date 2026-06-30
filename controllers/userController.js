import User from "../models/User.js";

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
const userController = { getProfile, updateProfile , uploadResume };

export default userController;