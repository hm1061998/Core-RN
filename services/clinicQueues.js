import { stringify } from 'qs';
import request from '~/utils/request';
import { API_SERVER_2 } from '@env';
// import log from '@/utils/log';

export async function queryDetail(params) {
  return request(`${API_SERVER_2}/clinicReceiptDetail/${params}`);
}
export async function query(params) {
  return request(`${API_SERVER_2}/clinicQueues?${stringify(params)}`);
}

export async function generateForm(id) {
  return request(`${API_SERVER_2}/clinicQueues/get/form/receipt/${id}`);
}

export function info(id, query) {
  // const urlRequest = `${API_ENDPOINT}/companies/${id}`;
  return request(`${API_SERVER_2}/clinicQueues/${id}?${stringify(query)}`, {
    method: 'GET',
  });
}

export async function del(id) {
  // console.log("id", id)
  return request(`${API_SERVER_2}/clinicQueues/${id}`, {
    method: 'DELETE',
  });
}

export async function add(params) {
  return request(`${API_SERVER_2}/clinicQueues`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function addWithSocial(params) {
  return request(`${API_SERVER_2}/clinicQueues/createWithSocial`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function update({ params, id }) {
  // console.log("dadsa", id, params)
  // const urlRequest = `${API_ENDPOINT}/companies/${id}`;
  const urlRequest = `${API_SERVER_2}/clinicQueues/${id}`;
  return request(urlRequest, {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function queryAll(params) {
  return request(`${API_SERVER_2}/clinicQueues/get/all?${stringify(params)}`);
  // return request(`${API_SERVER_2}/categories/get/all`);
}

export async function querysocialChannels(params) {
  return request(`${API_SERVER_2}/socialChannels?${stringify(params)}`);
}

export async function queryAllChannelsClinicQueues(params) {
  return request(`${API_SERVER_2}/socialChannels/get/all?${stringify(params)}`);
  // return request(`${API_SERVER_2}/categories/get/all`);
}
export async function queryScheduleTime(params) {
  return request(
    `${API_SERVER_2}/clinicQueues/schedule/time?${stringify(params)}`,
  );
}

export async function createSchedule(params) {
  return request(`${API_SERVER_2}/clinicQueues/createWithSocial`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
