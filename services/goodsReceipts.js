import { stringify } from 'qs';
import request from '~/utils/request';
import { API_SERVER_2 } from '@env';

// user
export async function query(params) {
  return request(`${API_SERVER_2}/goodsReceipts?${stringify(params)}`);
}

export function info(id) {
  // const urlRequest = `${API_ENDPOINT}/companies/${id}`;
  return request(`${API_SERVER_2}/goodsReceipts/${id}`, {
    method: 'GET',
  });
}

export async function del(id) {
  // console.log("id", id)
  return request(`${API_SERVER_2}/goodsReceipts/${id}`, {
    method: 'DELETE',
  });
}

export async function add(params) {
  return request(`${API_SERVER_2}/goodsReceipts`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
export async function addv2(params) {
  return request(`${API_SERVER_2}/goodsReceipts/v2`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
export async function updatev2(id, params) {
  // const urlRequest = `${API_ENDPOINT}/companies/${id}`;
  const urlRequest = `${API_SERVER_2}/goodsReceipts/v2/${id}`;
  return request(urlRequest, {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}
export async function update(id, params) {
  // const urlRequest = `${API_ENDPOINT}/companies/${id}`;
  const urlRequest = `${API_SERVER_2}/goodsReceipts/${id}`;
  return request(urlRequest, {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function queryAll(params) {
  return request(`${API_SERVER_2}/goodsReceipts/get/all?${stringify(params)}`);
  // return request(`${CONFIG.API_SERVER_2}/goodsReceipts/get/all`);
}

export async function queryformCodes(params) {
  return request(`${API_SERVER_2}/formCodes/generate?${stringify(params)}`);
  // return request(`${CONFIG.API_SERVER_2}/goodsReceipts/get/all`);
}
