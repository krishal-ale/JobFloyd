import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAppliedJobs } from "@/redux/applicationSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";



const useGetAppliedJobs = () => {
    const dispatch = useDispatch();

    useEffect(()=>{
        const fatchAppliedJobs = async()=>{
           try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/get-applied-jobs`,{
                withCredentials:true
            });
            if (res.data.success){
                dispatch(setAppliedJobs(res.data.applications));
            }
           } catch (error) {
            console.log(error);
           }
        }
        fatchAppliedJobs();
    },[]);
};

export default useGetAppliedJobs;