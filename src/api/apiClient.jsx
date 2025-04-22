import axios from "axios";
import CryptoJS from 'crypto-js';
import { logOutRedirectCall, loginRedirectCall } from '../Common/RedirectPathManage'


let key = CryptoJS.enc.Hex.parse(process.env.REACT_APP_KEY);
let iv = CryptoJS.enc.Hex.parse(process.env.REACT_APP_IV);



const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_PATH,
 
  headers: {
    "api-key": process.env.REACT_APP_API_KEY_ENC,
    'Accept-Language': process.env.REACT_APP_API_LANG,
    "Content-Type": process.env.REACT_APP_API_CONT_TYPE,
  },
});

// Body Encryption Request
axiosClient.interceptors.request.use(function (request) {
  
  request.data = bodyEncryption(request.data, true)
 
  
  if (sessionStorage.getItem("UserToken") !== undefined || sessionStorage.getItem("UserToken") !== null) {
    request.headers['token'] = bodyEncryption(JSON.stringify(sessionStorage.getItem("UserToken")), false)
  }
  
  return request;
});

axiosClient.interceptors.response.use(
  function (response) {
    response = bodyDecryption(response.data);

    let respData = JSON.parse(response);
    if (respData.code === -1) {
      logOutRedirectCall();
      return;
    }
    if (response.code === 0) {
     
    }
    response = JSON.parse(response)
    return response;
  },
  function (error) {
    let res = error.response;
   
    if (res.status === 401) {
      logOutRedirectCall()
    }
    console.error("Looks like there was a problem. Status Code: " + res.status);
    return Promise.reject(error);
  }
); 

function bodyEncryption(request, isStringify) {
  

  var request = (isStringify) ? JSON.stringify(request) : request;
  let encrypted = CryptoJS.AES.encrypt(request, key, { iv: iv });
  return encrypted.toString();
}

function bodyDecryption(request) {
  let decrypted = CryptoJS.AES.decrypt(request.toString(), key, { iv: iv });
  

  return decrypted.toString(CryptoJS.enc.Utf8);
}

export { axiosClient };