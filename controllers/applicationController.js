import Application from "../models/Application.js";
import Job from "../models/Job.js";

const applyJob = async (req, res) => {
  const { jobId } = req.body;

  if (req.user.role !== "student") {
    res.status(403);
    throw new Error("Only students can apply for jobs");
  }

  const job = await Job.findById(jobId);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  const alreadyApplied = await Application.findOne({
    job: jobId,
    student: req.user._id,
  });

  if (alreadyApplied) {
    res.status(409);
    throw new Error("You already applied for this job");
  }

  const application = await Application.create({
    job: jobId,
    student: req.user._id,
  });

  res.status(201).json(application);
};

const getMyApplications = async (req, res) => {
  const applications = await Application.find({ student: req.user._id })
    .populate("job")
    .populate("student", "name email phone");

  res.status(200).json(applications);
};


const getJobApplicants = async (req, res) => {
  if (req.user.role !== "recruiter") {
    res.status(403);
    throw new Error("Only recruiters can view applicants");
  }

  const job = await Job.findById(req.params.jobId);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.recruiter.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You are not authorized to view these applicants");
  }

  const applications = await Application.find({ job: req.params.jobId })
    .populate("student", "name email phone")
    .populate("job", "title company location");

  res.status(200).json(applications);
};


const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;

  if (req.user.role !== "recruiter") {
    res.status(403);
    throw new Error("Only recruiters can update status");
  }

  const application = await Application.findById(req.params.id).populate("job");

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  if (application.job.recruiter.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You are not authorized to update this application");
  }

  application.status = status;
  await application.save();

  res.status(200).json(application);
};

const applicationController = {
  applyJob ,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus
};

export default applicationController;