import Job from "../models/job.model.js";

export const createJob = async (req,res) =>{
    try {
        const {title,description, requirement, salary, location, jobType, experience, position, company} = req.body;

        const userId = req.id;

        if(!title || !description || !requirement || !salary || !location || !jobType || !experience || !position || !company){
            return res.status(400).json({message:"All fields are required", success:false});
        };

        const job = await Job.create({
            title,
            description,
            requirement: requirement.split(','),
            salary: Number(salary),
            location,
            jobType,
            experience,
            position,
            company: companyId,
            created_by: userId,
        })

        return res.status(201).json({message:"Job posted successfully", success:true, job});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong",
            success: false,
            error: error.message,
        });
    }
}

export const getAllJobs = async (req,res) =>{
    try {
        const keyword = req.query.keyword || '';
        const query = {
            $or: [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
            ]
        };
        const jobs = await Job.find(query);
        if (!jobs) {
            return res.status(404).json({ message: 'No jobs found', success: false });
        }
        return res.status(200).json({ message: 'Jobs found', success: true, jobs });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong",
            success: false,
            error: error.message,
        });
    }
}

export const getJobById = async (req,res) =>{
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found', success: false });
        }
        return res.status(200).json({ message: 'Job found', success: true, job });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong",
            success: false,
            error: error.message,
        });
    }
}

export const getJobsByEmployerId = async (req,res) =>{
    try {
        const userId = req.id;

        const jobs = await Job.find({ created_by: userId });
        if (!jobs) {
            return res.status(404).json({ message: 'No jobs found', success: false });
        }
        return res.status(200).json({ message: 'Jobs found', success: true, jobs });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong",
            success: false,
            error: error.message,
        });
    }
}
