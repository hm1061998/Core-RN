import { stringify } from 'qs';
import request from '~/utils/request';
import { API_SERVER_2 } from '@env';

// user
export async function query(params) {
  return request(`${API_SERVER_2}/goodsIssues?${stringify(params)}`);
}

export async function queryTransfer(params) {
  // log(' querygoodsIssues ', `${API_SERVER_2}/goodsIssues?${stringify(params)}`)
  return request(
    `${API_SERVER_2}/goodsIssues/getlist/transfer?${stringify(params)}`,
  );
}

export async function queryConsumable(params) {
  // log(' querygoodsIssues ', `${API_SERVER_2}/goodsIssues?${stringify(params)}`)
  return request(
    `${API_SERVER_2}/goodsIssues/getlist/consumable?${stringify(params)}`,
  );
}

export async function queryImportInternal(params) {
  // log(' querygoodsIssues ', `${API_SERVER_2}/goodsIssues?${stringify(params)}`)
  return request(
    `${API_SERVER_2}/goodsReceipts/getlist/importInternal?${stringify(params)}`,
  );
}

export function info(id) {
  // const urlRequest = `${API_ENDPOINT}/companies/${id}`;
  return request(`${API_SERVER_2}/goodsIssues/${id}`, {
    method: 'GET',
  });
}

export async function del(id) {
  // console.log("id", id)
  return request(`${API_SERVER_2}/goodsIssues/${id}`, {
    method: 'DELETE',
  });
}

export async function add(params) {
  return request(`${API_SERVER_2}/goodsIssues`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function update(id, params) {
  // const urlRequest = `${API_ENDPOINT}/companies/${id}`;
  const urlRequest = `${API_SERVER_2}/goodsIssues/${id}`;
  return request(urlRequest, {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function addv2(params) {
  return request(`${API_SERVER_2}/goodsIssues/v2`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function addOrEditTransfer(params) {
  return request(`${API_SERVER_2}/goodsIssues/transfer`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updatev2(id, params) {
  // const urlRequest = `${API_ENDPOINT}/companies/${id}`;
  const urlRequest = `${API_SERVER_2}/goodsIssues/v2/${id}`;
  return request(urlRequest, {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function queryAll(params) {
  return request(`${API_SERVER_2}/goodsIssues/get/all?${stringify(params)}`);
  // return request(`${API_SERVER_2}/goodsIssues/get/all`);
}

export async function queryNational(params) {
  return request(`${API_SERVER_2}/lienthongduocquocgia/don_thuoc_quoc_gia`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
