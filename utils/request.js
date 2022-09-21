import Auth from '~/utils/Auth';
import axios from 'axios';
import Toast from '~/lib/RN-root-toast';
/* const codeMessage = {
  200: 'The server successfully returned the requested data.',
  201: 'New or modified data is successful.',
  202: 'A request has entered the background queue (asynchronous task).',
  204: 'The data was deleted successfully.',
  400: 'The request was made with an error and the server did not perform any new or modified data operations.',
  401: 'User does not have permission (token, username, password is incorrect).',
  403: 'The user is authorized, but access is forbidden.',
  404: 'The request is made for a record that does not exist and the server does not operate.',
  406: 'The format of the request is not available.',
  410: 'The requested resource is permanently deleted and will not be retrieved.',
  422: 'A validation error occurred when creating an object.',
  500: 'An error occurred on the server. Please check the server.',
  502: 'Gateway error.',
  503: 'The service is unavailable and the server is temporarily overloaded or maintained.',
  504: 'The gateway timed out.',
}; */

/*
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, option, initialToken) {
  const options = {
    ...option,
  };

  // const token = initialToken || auth_key || null;
  const token = initialToken || Auth.token || null;
  const defaultHeaders = token
    ? {
        'X-Auth-Key': `${token}`,
        // token,
        // authorization: `Bearer ${token}`,
      }
    : {};
  const defaultOptions = {
    // credentials: 'include',
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  const newOptions = { ...defaultOptions, ...options, timeout: 180000 };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        // 'subscriptionId': 'this is a string \nand this is a new line',
        ...newOptions.headers,
      };
      newOptions.data = JSON.stringify(newOptions.body);
      // console.log('body', newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
      newOptions.data = newOptions.body;
    }
  }

  try {
    // console.log('url', url);
    const result = await axios(url, newOptions);
    const response = result?.data;
    if (
      response?.error?.message === 'Bạn chưa đăng nhập' ||
      response?.message === 'Token hết hạn'
    ) {
      Auth.expire();
      Toast.show('Đăng nhập quá hạn, vui lòng đăng nhập lại!', {
        duration: 1500,
        position: Toast.positions.CENTER,
      });
    }
    // console.log('response', response);
    return response;
  } catch (e) {
    const status = e.name;
    if (status === 401) {
      Auth.expire();
      Toast.show('Đăng nhập quá hạn, vui lòng đăng nhập lại!', {
        duration: 1500,
        position: Toast.positions.CENTER,
      });
    }
  }
}
