import React, { use, useEffect } from 'react'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAllCompanies } from '@/redux/companySlice';
import { COMPANY_API_END_POINT } from '@/utils/constant';

const useGetAllCompanies = () => {
    const dispatch = useDispatch();
  useEffect(()=>{
    const fetchAllCompanies = async () =>{
        try {
            const res = await axios.get(`${COMPANY_API_END_POINT}/company-user/`,{withCredentials:true});
            if(res.data.success){
                dispatch(setAllCompanies(res.data.company));
            }
        } catch (error) {
            console.log(error);
        }
    }
    fetchAllCompanies();
  },[dispatch])
}

export default useGetAllCompanies
