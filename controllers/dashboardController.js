import Job from "../models/Job.js";
import Application from "../models/Application.js";

const getStudentDashboard = async (req, res) => {
  if (req.user.role !== "student") {
    res.status(403);
    throw new Error("Only students can access this dashboard");
  }

  const totalApplied = await Application.countDocuments({
    student: req.user._id,
  });

  const pending = await Application.countDocuments({
    student: req.user._id,
    status: "pending",
  });

  const selected = await Application.countDocuments({
    student: req.user._id,
    status: "selected",
  });

  const rejected = await Application.countDocuments({
    student: req.user._id,
    status: "rejected",
  });

  res.status(200).json({
    totalApplied,
    pending,
    selected,
    rejected,
  });
};

const getRecruiterDashboard = async (req, res) => {
  if (req.user.role !== "recruiter") {
    res.status(403);
    throw new Error("Only recruiters can access this dashboard");
  }

  const recruiterJobs = await Job.find({ recruiter: req.user._id }).select("_id");

  const jobIds = recruiterJobs.map((job) => job._id);

  const totalJobs = recruiterJobs.length;

  const totalApplicants = await Application.countDocuments({
    job: { $in: jobIds },
  });

  const selected = await Application.countDocuments({
    job: { $in: jobIds },
    status: "selected",
  });

  const rejected = await Application.countDocuments({
    job: { $in: jobIds },
    status: "rejected",
  });

  const pending = await Application.countDocuments({
    job: { $in: jobIds },
    status: "pending",
  });

  res.status(200).json({
    totalJobs,
    totalApplicants,
    pending,
    selected,
    rejected,
  });
};

const dashboardController = {
  getStudentDashboard,
  getRecruiterDashboard,
};

export default dashboardController;