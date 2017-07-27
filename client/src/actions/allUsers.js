import axios from 'axios';
import { VIEW_ALL_USERS } from './actionTypes';

/**
 * @description Dispatches action to view all documents
 * @param  {object} users
 * @param  {object} pagination
 * @return {object}
 */
export const getAllUsers = (users, pagination) => {
	return {
		type: VIEW_ALL_USERS,
		users,
		pagination
	};
};

/**
 * @param  {object} params
 * @return {function} dispatch
 */
export const allUsers = (params) => {
	return dispatch => {
		return axios.get(`/api/v1/users?offset=${params.offset}&limit=${params.limit}`).then((res) => {
			dispatch(getAllUsers(res.data.users, res.data.pagination));
			return Promise.resolve(res);
		});
	};
};
