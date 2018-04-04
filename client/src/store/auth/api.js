import $ from 'jquery'
import accessToken from './reducers'
import Cookies from 'js-cookie';
import { csrfSafeMethod } from './actions'

export const apiLogin = function(username, password){
    var csrftoken = Cookies.get('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("x-csrftoken", csrftoken);
            }
        }
    });
    return $.ajax({
        url: '/accounts/login/',
        dataType: 'json',
        type : 'POST',
        data : {
            username : username, 
            password : password
        }
    }).then(response => {
        return response
    }).catch(error => {
        throw error
    });
}

export const apiLogout = function(){
    var csrftoken = Cookies.get('csrftoken');

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("x-csrftoken", csrftoken);
            }
        }
    });
    return $.ajax({
        url: '/accounts/logout/',
        dataType: 'json',
        type : 'GET',
    }).then(response => {
        return response
    }).catch(error => {
        throw error
    });
}


