import Company from '../models/company.model.js';
import getDataUri from '../utils/dataUri.js';
import cloudinary from '../utils/cloudinary.js';

export const registerCompany = async (req, res) => {
    try {
        const { name, description, website, industry, pan_vat_num, location} = req.body;
       
        if (!name){
            return res.status(400).json({ message: 'Name and PAN/VAT number are required', success: false });
        }    
        const existingCompany = await Company.findOne({ pan_vat_num });
        if (existingCompany) {
            return res.status(400).json({ message: 'Company with this PAN/VAT number already exists', success: false });
        }
        const company = new Company({
            name,
            description,
            website,
            industry,
            pan_vat_num,
            location,
            userId: req.id,
        });
        await company.save();
        res.status(201).json({ message: 'Company registered successfully', success: true, company });
    } 
        
        catch (error) {
        console.log(error);
    }
}

export const getCompanyByUserId = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.id });
        if (!company) {
            return res.status(404).json({ message: 'Company not found', success: false });
        }
        res.status(200).json({ message: 'Company found', success: true, company });
    } catch (error) {
        console.log(error);
    }
}

export const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);      
        if (!company) {
            return res.status(404).json({ message: 'Company not found', success: false });
        }
        res.status(200).json({ message: 'Company found', success: true, company });
    } catch (error) {
        console.log(error);
    }
}

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, industry, pan_vat_num, location} = req.body;
 
        const file = req.file;

        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        let logo;
if (req.file) {
    const fileUri = getDataUri(req.file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    logo = cloudResponse.secure_url;
}


        const company = await Company.findByIdAndUpdate(req.params.id, {
            name,
            description,
            website,
            industry,
            pan_vat_num,
            location,
            logo,
        }, { new: true });
        if (!company) {
            return res.status(404).json({ message: 'Company not found', success: false });
        }
        res.status(200).json({ message: 'Company updated successfully', success: true, company });
    } catch (error) {
        console.log(error);
    }
}        

