class Utilities{
	static percentify(value){
		if(!value && value !== 0.0){
			return value 
		}
	
		value = parseFloat(value)
		if(value){
			value = value.toFixed(2)
			value = String(value) + ' %'
			return value 
		}
	}
	static round(value, num){
		if(!value && value !== 0.0){
			return value 
		}
		value = parseFloat(value)
		if(value){
			value = value.toFixed(num)
			return value 
		}
	}
}

export default Utilities;