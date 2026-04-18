import { JOB_API_END_POINT } from '@/utils/constant';
import { useEffect } from 'react';
import axios from "@/utils/axiosInstance";
import { useDispatch } from 'react-redux';
import { setAllAdminJobs } from '@/redux/jobSlice';

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/employer-jobs`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    dispatch(setAllAdminJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchAllJobs();
    }, []);
};

export default useGetAllAdminJobs;