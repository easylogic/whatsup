import axios, { AxiosRequestConfig } from 'axios';
import curlirize from 'axios-curlirize';


export const customizedAxios = axios.create({
  withCredentials: true,
});

curlirize(customizedAxios, (result, err) => {
  const { command } = result;
  if (err) {
    // use your logger here
  } else {
    // use your logger here
  }
});

customizedAxios.interceptors.request.use(
  (config: AxiosRequestConfig) => {

    // TODO: hook for authorization  

    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  },
);

customizedAxios.interceptors.response.use(
  response => {
    const result = response.data.result;

    if (result.status !== 200) {
      return Promise.reject({ known: true, ...response });
    }
    return response;
  },
  error => {
    return Promise.reject(error);
  },
);

export const JSONConfig = { headers: { 'Content-Type': 'application/json' } };
