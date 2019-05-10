import axios from 'axios';
import {
  FETCH_USER,
  DONE_LOADING,
  PARTIAL_LOADING,
  SEARCH,
  FETCH_PROFILE,
  UPDATE_RESUME,
  FETCH_POST,
  FETCH_DEPARTMENT,
  UPDATE_PROFILE,
  POST_DATA,
  NOTIFICATION
} from './types';

export const fetchUser = () => async (dispatch) => {
  dispatch({ type: DONE_LOADING, payload: false });
  try {
    const res = await axios.get('/api/current_user');
    dispatch({ type: FETCH_USER, payload: res.data });
    dispatch({ type: DONE_LOADING, payload: true });
  } catch {
    dispatch({ type: FETCH_USER, payload: false });
    dispatch({ type: DONE_LOADING, payload: true });
  }
};

export const updateUser = body => async (dispatch) => {
  dispatch({ type: PARTIAL_LOADING, payload: false });
  const formData = new FormData();
  formData.append('name', body.name);
  formData.append('bio', body.bio);
  formData.append('filename', body.filename);
  if (body.files != null) formData.append('file', body.files);

  await axios({
    method: 'post',
    url: '/api/setup/',
    data: formData,
    config: { headers: { 'Content-Type': 'multipart/form-data' } },
  });

  try {
    const res = await axios.get('/api/current_user');
    await dispatch({ type: FETCH_USER, payload: res.data });
  } catch {
    await dispatch({ type: FETCH_USER, payload: false });
  }
  dispatch({ type: PARTIAL_LOADING, payload: true });
};

export const uploadResume = resume => async (dispatch) => {
  dispatch({ type: PARTIAL_LOADING, payload: false });

  const formData = new FormData();
  formData.append('file', resume);

  const res = await axios({
    method: 'post',
    url: '/api/resume/',
    data: formData,
    config: { headers: { 'Content-Type': 'multipart/form-data' } },
  });

  console.log(res.data);

  dispatch({
    type: UPDATE_RESUME,
    payload: res.data,
  });

  dispatch({ type: PARTIAL_LOADING, payload: true });
};

export const fetchPost = (id, spinner) => async (dispatch) => {
  if (spinner) {
    dispatch({ type: PARTIAL_LOADING, payload: false });
  }

  const res = await axios.get('/api/research_posts/', {
    params: {
      id,
    },
  });

  if (spinner) {
    dispatch({ type: PARTIAL_LOADING, payload: true });
  }

  dispatch({ type: FETCH_POST, payload: res.data });
};

export const fetchPosts = () => async (dispatch) => {
  const res = await axios.get('/api/research_posts');
  return res.data;
};

export const savePost = post => async (dispatch) => {
  dispatch({ type: POST_DATA, payload: post });
};

export const fetchDepartment = id => async (dispatch) => {
  const res = await axios.get('/api/department/', {
    params: {
      id,
    },
  });

  dispatch({ type: FETCH_DEPARTMENT, payload: res.data });
};

export const fetchDepartments = () => async (dispatch) => {
  const res = await axios.get('/api/department');
  return res.data;
};

export const fetchFacultyMember = cruzid => async (dispatch) => {
  const res = await axios.get('/api/faculty_members/', {
    params: {
      cruzid,
    },
  });
  dispatch({
    type: FETCH_PROFILE,
    payload: res.data,
  });
};

export const fetchFacultyMemberByID = id => async (dispatch) => {
  const res = await axios.get('/api/faculty_members/', {
    params: {
      id,
    },
  });

  dispatch({
    type: FETCH_PROFILE,
    payload: res.data,
  });
};

export const fetchStudent = cruzid => async (dispatch) => {
  const res = await axios.get('/api/students/', {
    params: {
      cruzid,
    },
  });

  dispatch({
    type: FETCH_PROFILE,
    payload: res.data,
  });
};

export const fetchProfile = cruzid => async (dispatch) => {
  // dispatch({ type: LOAD_PROFILE, payload: true });

  let res = await axios.get('/api/students/', {
    params: {
      cruzid,
    },
  });

  if (res.data.cruzid == null) {
    res = await axios.get('/api/faculty_members/', {
      params: {
        cruzid,
      },
    });
  }


  dispatch({ type: FETCH_PROFILE, payload: res.data });
  // dispatch({ type: LOAD_PROFILE, payload: false });
};

export const updateProfile = profile => async (dispatch) => {
  dispatch({ type: PARTIAL_LOADING, payload: false });
  const res = await axios.post('/api/updateStudent/', profile);
  dispatch({
    type: UPDATE_PROFILE,
    payload: res.data,
  });
  dispatch({ type: PARTIAL_LOADING, payload: true });
};

export const searchPosts = (type, query) => async (dispatch) => {
  dispatch({ type: PARTIAL_LOADING, payload: false });

  const res = await axios.get('/api/search/', {
    params: {
      type,
      query,
    },
  });

  dispatch({
    type: SEARCH,
    payload: res.data,
  });

  dispatch({ type: PARTIAL_LOADING, payload: true });
};

export const startPartialLoading = () => async (dispatch) => {
  dispatch({ type: PARTIAL_LOADING, payload: false });
};

export const stopPartialLoading = () => async (dispatch) => {
  dispatch({ type: PARTIAL_LOADING, payload: true });
};

export const fetch_notification = (cruzid, sendType) => async dispatch => {
  //dispatch({ type: LOAD_NOTIFICATION, payload: false });

  let res = await axios.get("/api/notification/", {
    params: {
      cruzid: cruzid,
      type: sendType
    }
  });

  dispatch({ type: NOTIFICATION, payload: res.data });
  //dispatch({ type: LOAD_NOTIFICATION, payload: true });
};

export const notify_user = (cruzid, type) => async dispatch => {
  let res = await axios.post("/api/notification/", {
    params: {
      cruzid: cruzid,
      type: type
    }
  });

  dispatch({ type: NOTIFICATION, payload: res.data });
};