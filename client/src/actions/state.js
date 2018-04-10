export const clearSuccesses = function(parent){
	return function(type){
		const PARENT = parent.toUpperCase()
		return {
	        type : `CLEAR_${PARENT}_SUCCESSES`,
	        success_type : type
	    }
	}
}

export const clearErrors = function(parent){
	return function(type){
		const PARENT = parent.toUpperCase()
	    return {
	        type : `CLEAR_${PARENT}_ERRORS`,
	        error_type : type
	    }
	}
}
