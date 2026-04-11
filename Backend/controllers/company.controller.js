import Company from '../models/company.model.js';
import getDataUri from '../utils/dataUri.js';
import cloudinary from '../utils/cloudinary.js';

export const registerCompany = async (req, res) => {
    try {
        const { name, description, website, industry, pan_vat_num, location, noPan } = req.body;

        
        const existingUserCompany = await Company.findOne({ userId: req.id });
        if (existingUserCompany) {
            return res.status(400).json({ message: 'You have already registered a company', success: false });
        }

        
        if (noPan === 'true' || noPan === true) {
            const company = await Company.create({
                name: 'Unknown Company',
                userId: req.id,
                isVerified: false,
            });
            return res.status(201).json({ message: 'Company registered successfully', success: true, company });
        }

        if (!name) {
            return res.status(400).json({ message: 'Company name is required', success: false });
        }

        
        if (pan_vat_num) {
            const panExists = await Company.findOne({ pan_vat_num });
            if (panExists) {
                return res.status(400).json({ message: 'A company with this PAN/VAT number already exists', success: false });
            }
        }

        const company = await Company.create({
            name,
            description,
            website,
            industry,
            pan_vat_num: pan_vat_num || null,
            location,
            userId: req.id,
            isVerified: !!pan_vat_num,
        });

        res.status(201).json({ message: 'Company registered successfully', success: true, company });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', success: false });
    }
};

export const getCompanyByUserId = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.id });
        if (!company) {
            return res.status(404).json({ message: 'No company found', success: false });
        }
        res.status(200).json({ success: true, company });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', success: false });
    }
};

export const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found', success: false });
        }
        res.status(200).json({ success: true, company });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', success: false });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, industry, pan_vat_num, location } = req.body;

        if (pan_vat_num) {
            const panExists = await Company.findOne({ pan_vat_num, _id: { $ne: req.params.id } });
            if (panExists) {
                return res.status(400).json({ message: 'A company with this PAN/VAT number already exists', success: false });
            }
        }

        let logo;
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logo = cloudResponse.secure_url;
        }

        const updateData = {
            name,
            description,
            website,
            industry,
            pan_vat_num: pan_vat_num || null,
            location,
            isVerified: !!pan_vat_num,
        };
        if (logo) updateData.logo = logo;

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!company) {
            return res.status(404).json({ message: 'Company not found', success: false });
        }
        res.status(200).json({ message: 'Company updated successfully', success: true, company });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', success: false });
    }
};