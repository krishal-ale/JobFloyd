import Application from "../models/application.model.js";
import Job from "../models/job.model.js";



export const applyJob = async (req,res) =>{
    try {
       const userId = req.id;
       const jobId = req.params.id;

       if(!jobId){
        return res.status(400).json({message:"Job ID is required", success:false});
       }
       
       const existingApplication = await Application.findOne({applicant:userId, job:jobId});

       if(existingApplication){
        return res.status(400).json({message:"You have already applied for this job", success:false});
       }

      const job = await Job.findById(jobId);

      if(!job){
        return res.status(404).json({message:"Job not found", success:false});
      }

      const newApplication = await Application.create({
        applicant:userId,
        job:jobId,
      });

      job.applications.push(newApplication._id);
      await job.save();

      return res.status(201).json({message:"Application submitted successfully", success:true});


        
    } catch (error) {
        console.log(error);
    }
}

export const getAppliedJobs = async (req,res) =>{
    try {
        const userId = req.id;

        const applications = (await Application.find({applicant:userId})).toSorted({createdAt: -1}).populate({
            path: 'job',
            options:{sort:{createdAt: -1}},
            populate:{
                path:'company',
                options:{sort:{createdAt: -1}},
            }
        });

        if (!applications) {
            return res.status(404).json({ message: 'No applications found', success: false });
        }
        return res.status(200).json({ message: 'Applications found', success: true, applications });

    } catch (error) {
        
    }
}


export const getJobApplications = async (req,res) =>{
    try {
        const jobId = req.params.id;
 
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options:{sort:{createdAt: -1}},
            populate:{
                path:'applicant',
            }
        });

        if (!job) {
            return res.status(404).json({ message: 'Job not found', success: false });
        }

        return res.status(200).json({ message: 'Applications found', success: true, job }); 
                    


    } catch (error) {
        console.log(error);
    }
}

export const updateApplicationStatus = async (req,res) =>{
    try {
        const {status} = req.body;
        const applicationId = req.params.id;

        if (!status){
            return res.status(400).json({message:"Status is required", success:false});

        }

        const application = await Application.findByIdAndUpdate(applicationId, {status}, {new:true});

        if(!application){
            return res.status(404).json({message:"Application not found", success:false});
        };

        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({message:"Application status updated successfully", success:true});


        


    } catch (error) {
        console.log(error);
    }
}