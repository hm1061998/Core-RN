import { stringify } from 'qs';
import request from '~/utils/request';
import { API_SERVER_WEB, API_SERVER_2 } from '@env';

export async function query(params) {
  // console.log(`${API_SERVER_WEB}/stories?${stringify(params)}`);
  return request(`${API_SERVER_2}/bloodGroups?${stringify(params)}`);
}

export async function info(id) {
  return request(`${API_SERVER_2}/bloodGroups/${id}`);
}

export async function update({ params, id }) {
  return request(`${API_SERVER_2}/bloodGroups/${id}`, {
    method: 'PUT',
    body: params,
  });
}

export async function add(params) {
  return request(`${API_SERVER_2}/bloodGroups`, {
    method: 'POST',
    body: params,
  });
}

export async function del(id) {
  return request(`${API_SERVER_2}/bloodGroups/${id}`, {
    method: 'DELETE',
  });
}
