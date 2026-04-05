import React from 'react'
import ApplicantsTable from './ApplicantsTable'
import { useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/shared/Navbar';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useDispatch } from 'react-redux';
import { setApplications } from '@/redux/applicationSlice';
import { useParams } from 'react-router-dom';

const Applicants = () => {

    const params = useParams();
        const dispatch = useDispatch();
        const {applicants} = useSelector((store)=>store.applicationSlice);

 useEffect(()=>{
    const fatchApplicants = async()=>{

        
        try{
           const res = await axios.get(`${APPLICATION_API_END_POINT}/get-job-applications/${params.id}`);
           dispatch(setApplications(res.data.applications));
        } catch(error){
            console.log(error);
        }
    }
    fatchApplicants();
 },[]);

  return (
    <div>
      <Navbar/>
      <div className='max-w-7xl mx-auto'>
        <h1 className='font-bold text-xl'>Applicants {applicants?.applicationSlice?.length}</h1>
        <ApplicantsTable/>

      </div>
    </div>
  )
}

export default Applicants
