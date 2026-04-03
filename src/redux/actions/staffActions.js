import { Api } from '@/services/service';
import { setStaffStats, setLoading, setError } from '../slices/staffSlice';

export const fetchStaffStats = (router = null) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    const res = await Api('get', 'staff/stats', '', router);
    
    if (res?.status) {
      const staffData = Array.isArray(res.data) ? res.data : res.data?.data || [];
      dispatch(setStaffStats(staffData));
    } else {
      dispatch(setError(res?.message || 'Failed to fetch staff stats'));
    }
    
    dispatch(setLoading(false));
    return { success: true, data: res.data };
  } catch (err) {
    dispatch(setLoading(false));
    dispatch(setError(err.message || 'An error occurred'));
    throw err;
  }
};
