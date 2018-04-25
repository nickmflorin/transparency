import request from 'superagent';
import Cookies from 'js-cookie';

export const dispatchRequest = next => (name) => {
    next({
        type: `${name}_REQUEST`, 
    })
}
