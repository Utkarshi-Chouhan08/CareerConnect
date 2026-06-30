import Job from "../models/Job.js";

const createJob = async (req, res) => {
  const { title, company, location, salary, jobType, skills, description } = req.body;

  if (!title || !company || !location || !description) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  if (req.user.role !== "recruiter") {
    res.status(403);
    throw new Error("Only recruiters can post jobs");
  }

  const job = await Job.create({
    title,
    company,
    location,
    salary,
    jobType,
    skills,
    description,
    recruiter: req.user._id,
  });

  res.status(201).json(job);
};


// const getAllJobs = async (req, res) => {
//   const jobs = await Job.find().populate("recruiter", "name email");

//   res.status(200).json(jobs);
// };



const getAllJobs = async (req, res) => {
  const { search, location, jobType } = req.query;

  let query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }

  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  if (jobType) {
    query.jobType = jobType;
  }

  const jobs = await Job.find(query).populate("recruiter", "name email");

  res.status(200).json(jobs);
};

const getSingleJob = async (req, res) => {
  const job = await Job.findById(req.params.id).populate("recruiter", "name email");

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  res.status(200).json(job);
};


const updateJob = async (req, res) => {

  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.recruiter.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You are not authorized to update this job");
  }

  const updatedJob = await Job.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedJob);
};


const deleteJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.recruiter.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You are not authorized to delete this job");
  }

  await job.deleteOne();

  res.status(200).json({
    message: "Job deleted successfully",
  });
};
const jobController = { createJob ,getAllJobs, getSingleJob , updateJob , deleteJob };

export default jobController;
