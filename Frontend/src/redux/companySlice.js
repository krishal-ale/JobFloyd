import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
    name: "company",
    initialState: {
        singleCompany: null,
        myCompany: null,         
        allCompanies: [],
        searchCompanybyText: "",
    },
    reducers: {
        setSingleCompany: (state, action) => { state.singleCompany = action.payload; },
        setMyCompany: (state, action) => { state.myCompany = action.payload; },
        setAllCompanies: (state, action) => { state.allCompanies = action.payload; },
        setSearchCompanybyText: (state, action) => { state.searchCompanybyText = action.payload; },
    },
});

export const { setSingleCompany, setMyCompany, setAllCompanies, setSearchCompanybyText } = companySlice.actions;
export default companySlice.reducer;