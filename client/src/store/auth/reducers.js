import Cookies from 'js-cookie';

export function accessToken(state) {
    if (state.access) {
        return state.access.token
    }
}
export function isAuthenticated(state) {
    var csrftoken = Cookies.get('csrftoken');
    if(state.user && state.access && state.access.token && csrftoken){
        return true 
    }
    return false 
}
export function user(state) {
    return state.user
}
export function errors(state) {
    return state.errors
}

