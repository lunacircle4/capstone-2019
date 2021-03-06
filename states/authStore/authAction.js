import axios from 'axios';
import {initialState} from './authReducer'
import {store} from '../store'

import { 
    OBTAIN_TOKEN_PENDING, OBTAIN_TOKEN_SUCCESS, OBTAIN_TOKEN_FAILURE,
    REFRESH_TOKEN_SUCCESS, CHANGE_NICKNAME_SUCCESS, CHANGE_NICKNAME_FAILURE, USER_AUTH_DELETE
} from './authReducer'

function obtainTokenResponse(payload) {
    return axios.post(initialState.endpoints.obtainJWT, payload)
}

function refreshTokenResponse() {
    return axios.post(initialState.endpoints.refreshJWT, 
        {refresh: store.getState().auth.data.refresh})
}

function changeNicknameResponse(payload) {
    return axios({
        method: 'put',
        url: '/nickname',
        data: payload,
        headers: { authorization: 'Bearer ' + store.getState().auth.data.access },
    })
}

function setUserData(response, email) {
    localStorage.setItem('acc', response.data.access)
    localStorage.setItem('ref', response.data.refresh)
    localStorage.setItem('nick', response.data.nickname)
    localStorage.setItem('ema', email)
}


export function obtainToken(payload) {
    return async dispatch => {
        // 먼저, 요청이 시작했다는것을 알립니다
        dispatch({ type: OBTAIN_TOKEN_PENDING });
        // 요청을 시작합니다
        // 여기서 만든 promise 를 return 해줘야, 나중에 컴포넌트에서 호출 할 때 getPost().then(...) 을 할 수 있습니다
        try {
            const response = await obtainTokenResponse(payload)
            setUserData(response, payload.email)
            dispatch({
                type: OBTAIN_TOKEN_SUCCESS,
                payload: {
                    data: {
                        email: payload.email,
                        ...response.data
                    },
                }
            })
        }
        catch(error) {
            dispatch({
                type: OBTAIN_TOKEN_FAILURE,
                payload: error.response.status,
            });
        }
    }
}

export function refreshToken() {
    return async dispatch => {
        try {
            const response = await refreshTokenResponse()
            localStorage.setItem('acc', response.data.access)
        
            dispatch({
                type: REFRESH_TOKEN_SUCCESS,
                payload: {access: response.data.access}
            })
        }
        catch(error) {
            dispatch({
                type: OBTAIN_TOKEN_FAILURE,
                payload: error.response.status,
            });
        }
    }
}

export function obtainTokenSuccess(data, email) {
    localStorage.setItem('ema', email)
    localStorage.setItem('acc', data.access)
    localStorage.setItem('ref', data.refresh)
    localStorage.setItem('nick', data.nickname)

    return async dispatch => {
        dispatch({
            type: OBTAIN_TOKEN_SUCCESS,
            payload: {
                data: {
                    ...data, email
                }
            }
        })
    }
}

export function logout() {
    return async dispatch => {
        localStorage.removeItem('acc')
        localStorage.removeItem('ref')
        localStorage.removeItem('nick')
        
        dispatch({
            type: USER_AUTH_DELETE,
        })
    }
}

export function changeNickname(payload) {
    return async dispatch => {
        // 먼저, 요청이 시작했다는것을 알립니다
        // 요청을 시작합니다
        // 여기서 만든 promise 를 return 해줘야, 나중에 컴포넌트에서 호출 할 때 getPost().then(...) 을 할 수 있습니다
        try {
            await changeNicknameResponse(payload)
            dispatch({
                type: CHANGE_NICKNAME_SUCCESS,
                payload: {
                    data: {
                        nickname: payload.nickname
                    },
                }
            })
        }
        catch(error) {
            dispatch({
                type: CHANGE_NICKNAME_FAILURE,
                payload: error.response,
            });
        }
    }
}