import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description:{
        type: String,
    },
    website:{
        type: String,
    },
    industry:{
        type: String,
        required: true,
    },
    pan_vat_num:{
        type: String,
        required: true,
    },
    location:{
        type: String,
        required: true,
    },
    logo:{
        type:String
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },  
},{timestamps: true,});

const Company = mongoose.model('Company', companySchema);

export default Company;