import request from '~/utils/request';
import { API_ENDPOINT, API_SERVER_WEB, API_SERVER_2 } from '@env';

export async function accountLogin(params) {
  // console.log(`${API_ENDPOINT}/authenticate`);
  return request(`${API_ENDPOINT}/authenticate`, {
    method: 'POST',
    body: params,
  });
}

export async function registerUser(params) {
  // console.log({ params });
  return request(`${API_SERVER_WEB}/users/register`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function queryCurrent(initialToken) {
  if (initialToken) {
    return request(`${API_SERVER_2}/currentUser`, null, initialToken);
  }
  return request(`${API_SERVER_2}/currentUser`);
}

export async function loginWithSocial({ params, token }) {
  return request(`${API_SERVER_WEB}/users/loginWithSocial`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
    headers: {
      'x-token': token,
    },
  });
}

export async function updateUser({ id, params }) {
  // const urlRequest = `${API_ENDPOINT}/companies/${id}`;
  const urlRequest = `${API_SERVER_2}/users/${id}`;
  return request(urlRequest, {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export function resetpass({ id, params }) {
  // const urlRequest = `${API_ENDPOINT}/companies/${id}`;
  return request(`${API_SERVER_2}/userspass/resetpass/${id}`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export function changepass({ id, params }) {
  // const urlRequest = `${API_ENDPOINT}/companies/${id}`;
  return request(`${API_SERVER_2}/users/changePass/${id}`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'put',
    },
  });
}
