import { stringify } from 'qs';
import request from '~/utils/request';
import { API_SERVER_2 } from '@env';

// user
export async function query(params) {
  // log(' querymedicines ', `${CONFIG.API_SERVER_2}/medicines?${stringify(params)}`)
  return request(`${API_SERVER_2}/medicines?${stringify(params)}`);
}

export function info(id, query) {
  // const urlRequest = `${API_ENDPOINT}/companies/${id}`;
  return request(`${API_SERVER_2}/medicines/${id}?${stringify(query)}`, {
    method: 'GET',
  });
}

export async function del(id) {
  // console.log("id", id)
  return request(`${API_SERVER_2}/medicines/${id}`, {
    method: 'DELETE',
  });
}

export async function add(params) {
  return request(`${API_SERVER_2}/medicines`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function update(id, params) {
  // const urlRequest = `${API_ENDPOINT}/companies/${id}`;
  const urlRequest = `${API_SERVER_2}/medicines/${id}`;
  return request(urlRequest, {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function queryAll(params) {
  return request(`${API_SERVER_2}/medicines/get/all?${stringify(params)}`);
  // return request(`${CONFIG.API_SERVER_2}/medicines/get/all`);
}
export async function querymedicinesWarehouse(params) {
  return request(
    `${API_SERVER_2}/medicines/get/all/available?${stringify(params)}`,
  );
  // return request(`${CONFIG.API_SERVER_2}/medicines/get/all`);
}
export async function querymedicinesFind(params) {
  return request(`${API_SERVER_2}/medicines/find/all?${stringify(params)}`);
  // return request(`${CONFIG.API_SERVER_2}/medicines/get/all`);
}
export async function querymedDosages(params) {
  return request(`${API_SERVER_2}/medDosages?${stringify(params)}`);
}

export async function addOrEdit(params) {
  return request(`${API_SERVER_2}/medicines/createUpdate`, {
    method: 'POST',
    body: {
      ...params,
      // method: 'post',
    },
  });
}
