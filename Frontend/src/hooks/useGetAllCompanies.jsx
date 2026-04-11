import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setMyCompany } from '@/redux/companySlice';
import { COMPANY_API_END_POINT } from '@/utils/constant';

const useGetMyCompany = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchMyCompany = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/company-user`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setMyCompany(res.data.company));
                } else {
                    dispatch(setMyCompany(null));
                }
            } catch {
                dispatch(setMyCompany(null));
            }
        };
        fetchMyCompany();
    }, [dispatch]);
};

export default useGetMyCompany;