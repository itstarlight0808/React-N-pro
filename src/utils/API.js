import Preference from 'react-native-preference'
import preferenceKeys from './preferenceKeys'
import axios from "axios";

export const STRIPE_TEST_KEY = ''

export const BASE_URL = 'https://gep.oncloud.gr/s1services'
const ROUTE = '/api'

const API_URL = BASE_URL + ROUTE

export const API = {
    //POST 
    DUMMY: API_URL + '/dummy',

    //GET
    GET_PROFILE: API_URL + '/get_profile',

}

export const requestPost = (url, data, extraHeaders = {}, extraOpptions = {}) => {
    return new Promise((resolve, reject) => {
        axios.post(url,
            data, {
            headers: {
                "Accept": "application/json",
                "Content-Type": 'application/json',
                ...extraHeaders
            },
            ...extraOpptions
        }).then(response => {
            console.log('API', 'requestPost-response.status', response.status);
            resolve(response.data);
        }).catch(error => {
            console.log('API', 'requestPost-error', error);
            reject(error);
        });
    });
}

export const requestPostWithToken = (url, data, extraHeaders = {}, extraOpptions = {}) => {
    const AUTH_TOKEN = Preference.get(preferenceKeys.AUTH_TOKEN)
    return new Promise((resolve, reject) => {
        axios.post(url,
            data, {
            headers: {
                "Accept": "application/json",
                "Content-Type": 'application/json',
                "Authorization": AUTH_TOKEN,
                ...extraHeaders
            },
            ...extraOpptions
        }).then(response => {
            console.log('API', 'requestPostWithToken-response.status', response.status);
            resolve(response.data);
        }).catch(error => {
            console.log('API', 'requestPostWithToken-error', error);
            reject(error);
        });
    });
}

export const requestGet = (url, extraHeaders = {}) => {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            headers: {
                "Accept": "application/json",
                ...extraHeaders
            }
        }).then(response => {
            console.log('API', 'requestGet-response.status', response.status);
            resolve(response.data);
        }).catch(error => {
            console.log('API', 'requestGet-error', error);
            reject(error);
        });
    });
}

export const requestGetWithToken = (url, extraHeaders = {}) => {
    const AUTH_TOKEN = Preference.get(preferenceKeys.AUTH_TOKEN)
    // console.log('API', 'requestGetWithToken-token', AUTH_TOKEN);
    return new Promise((resolve, reject) => {
        axios.get(url, {
            headers: {
                "Accept": "application/json",
                "Authorization": AUTH_TOKEN,
                ...extraHeaders
            }
        }).then(response => {
            console.log('API', 'requestGetWithToken-response.status', response.status);
            resolve(response.data);
        }).catch(error => {
            console.log('API', 'requestGetWithToken-error', error);
            reject(error);
        });
    });
}
