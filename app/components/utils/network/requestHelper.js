import axios from 'axios';
import { BASE_URL } from './api';

export const API_CALL = async (
  option,
  contentType = 'application/x-www-form-urlencoded; charset=UTF-8',
) => {
  try {
    try {
      // adding the authentication token
      const API_OPTION = {
        baseURL: BASE_URL,
        headers: {
          'Content-Type': contentType,
        },
        ...option,
      };
      console.log('API OPTION API CALL -> ', API_OPTION);
      const res = await axios.request(API_OPTION);
      return responseHandler(res);
    } catch (error) {
      console.log('error API_CALL', error);
    }
  } catch (error) {
    console.log('error API_CALL', error);
  }
};

export const responseHandler = (res) => {
    return res.data;
  };
