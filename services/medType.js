import { stringify } from 'qs';
import request from '~/utils/request';
import { API_SERVER_2 } from '@env';

// user
export async function query(params) {
  return request(`${API_SERVER_2}/types?${stringify(params)}`);
}

export function info(id) {
  // const urlRequest = `${API_ENDPOINT}/companies/${id}`;

  return request(`${API_SERVER_2}/types/${id}`, {
    method: 'GET',
  });
}

export async function del(id) {
  // console.log("id", id)
  return request(`${API_SERVER_2}/types/${id}`, {
    method: 'DELETE',
  });
}

export async function add(params) {
  return request(`${API_SERVER_2}/types`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function update(id, params) {
  // const urlRequest = `${API_ENDPOINT}/companies/${id}`;
  const urlRequest = `${API_SERVER_2}/types/${id}`;
  return request(urlRequest, {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function queryAll(params) {
  return request(`${API_SERVER_2}/types/get/all?${stringify(query)}`);
  // return request(`${CONFIG.API_SERVER_2}/types/get/all`);
}
