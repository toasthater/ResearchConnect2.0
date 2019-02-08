import axios from 'axios';
import { FETCH_USER, SEARCH } from './types';

export const fetchUser = () => async dispatch => {
        const res = await axios.get('/api/current_user');
        dispatch({type: FETCH_USER, payload: res.data});
};

export const fetchPosts = () => async dispatch => {
        const res = await axios.get('/api/research_posts');
        return res.data;
};

export const fetchDepartments = () => async dispatch => {
        const res = await axios.get('/api/department');
        return res.data;
};

export const fetchFaculty = () => async dispatch => {
        const res = await axios.get('/api/faculty_members');
        return res.data;
};

export const searchPosts = (type, query) => async dispatch => {
        const res = await axios.get('/api/search/',
        {
            params: {
                type: type,
                query: query
        }});

        dispatch({
            type: SEARCH,
            payload: res.data
        });
};
