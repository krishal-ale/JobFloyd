const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export const USER_API_END_POINT        = `${BASE_URL}/jobfloyd/user`;
export const JOB_API_END_POINT         = `${BASE_URL}/jobfloyd/job`;
export const APPLICATION_API_END_POINT = `${BASE_URL}/jobfloyd/application`;
export const COMPANY_API_END_POINT     = `${BASE_URL}/jobfloyd/company`;
export const RESUME_API_END_POINT      = `${BASE_URL}/jobfloyd/resume`;
export const SUPER_ADMIN_API_END_POINT = `${BASE_URL}/jobfloyd/superadmin`;