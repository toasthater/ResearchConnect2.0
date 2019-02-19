import axios from "axios";
import {
  FETCH_USER,
  DONE_LOADING,
  PARTIAL_LOADING,
  SEARCH,
  FETCH_FACULTY_MEMBER,
  FETCH_STUDENT,
  SETUP_USER
} from "./types";

export const fetchUser = () => async dispatch => {
  try {
    const res = await axios.get("/api/current_user");
    dispatch({ type: FETCH_USER, payload: res.data });
    dispatch({ type: DONE_LOADING, payload: true });
  } catch {
    dispatch({ type: FETCH_USER, payload: false });
    dispatch({ type: DONE_LOADING, payload: true });
  }
};

export const updateUser = (id, name, bio, profile_pic) => async dispatch => {
  // dispatch({type: DONE_LOADING, payload: false});
  const res = await axios.post("/api/user/setup/", {
    id: id,
    name: name,
    bio: bio,
    profile_pic: profile_pic,
    isSetup: true
  });

  dispatch({
    type: SETUP_USER,
    payload: res.data
  });
  dispatch({ type: DONE_LOADING, payload: true });
};

export const fetchPosts = () => async dispatch => {
  const res = await axios.get("/api/research_posts");
  return res.data;
};

export const fetchDepartment = id => async dispatch => {
  const res = await axios.get("/api/department/", {
    params: {
      id: id
    }
  });

  dispatch({
    payload: res.data
  });
};

export const fetchDepartments = () => async dispatch => {
  const res = await axios.get("/api/department");
  return res.data;
};

export const fetchFacultyMember = cruzid => async dispatch => {
  const res = await axios.get("/api/faculty_members/", {
    params: {
      cruzid: cruzid
    }
  });
  dispatch({
    type: FETCH_FACULTY_MEMBER,
    payload: res.data
  });
};

export const fetchStudent = cruzid => async dispatch => {
  const res = await axios.get("/api/students/", {
    params: {
      cruzid: cruzid
    }
  });

  dispatch({
    type: FETCH_STUDENT,
    payload: res.data
  });
};

export const searchPosts = (type, query) => async dispatch => {
  dispatch({ type: PARTIAL_LOADING, payload: false });

  const res = await axios.get("/api/search/", {
    params: {
      type: type,
      query: query
    }
  });

  dispatch({ type: PARTIAL_LOADING, payload: true });

  dispatch({
    type: SEARCH,
    payload: res.data
  });
};
