import { stringify } from 'qs';
import request from '~/utils/request';
import { API_SERVER_2 } from '@env';
// import log from '@/utils/log';

// user
export async function query(params) {
  return request(`${API_SERVER_2}/clinicReceipts?${stringify(params)}`);
}

export async function queryReceiptsCode(params) {
  return request(`${API_SERVER_2}/formCodes/generate?${stringify(params)}`);
}

export function info(id) {
  // const urlRequest = `${API_ENDPOINT}/companies/${id}`;
  return request(`${API_SERVER_2}/clinicReceipts/${id}`, {
    method: 'GET',
  });
}

export async function del(id) {
  // console.log("id", id)
  return request(`${API_SERVER_2}/clinicReceipts/${id}`, {
    method: 'DELETE',
  });
}

export async function add(params) {
  return request(`${API_SERVER_2}/clinicReceipts/createOrUpdate`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function update(params, id) {
  // console.log("dadsa", params)
  // const urlRequest = `${API_ENDPOINT}/companies/${id}`;
  const urlRequest = `${API_SERVER_2}/clinicReceipts/${id}`;
  return request(urlRequest, {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function queryAll(params) {
  return request(`${API_SERVER_2}/clinicReceipts/get/all?${stringify(params)}`);
  // return request(`${API_SERVER_2}/categories/get/all`);
}
