import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    website: { 
        type: String 
    },
    industry: { 
        type: String 
    },
    pan_vat_num: { 
        type: Number 
    },
    location: { 
        type: String 
    },
    logo: { 
        type: String 
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);
export default Company;