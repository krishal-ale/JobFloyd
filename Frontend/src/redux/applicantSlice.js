import {createSlice} from '@reduxjs/toolkit'

const applicantSlice = createSlice({
    name:'applicant',
    initialState:{
        applicants:[],
        
    },
    reducers:{
        setApplicants:(state,action)=>{
            state.applicants = action.payload;
        }
    }
});

export const {setApplicants} = applicantSlice.actions;
export default applicantSlice.reducer;