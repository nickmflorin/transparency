// Only Keep States with Small Amounts of Data and Importance to Not Overload Local Storage Between Refreshes
const serialized_states_to_keep = [
	'dates',
	'db',
	'lists',
	'managers'
]

export const loadState = () => {
	try {
		const serializedState = localStorage.getItem('state')
		if(serializedState === null){
			return undefined
		}
		var state = JSON.parse(serializedState)
		state['requesting'] = false
		return state
	} catch(err){
		return undefined
	}
}

export const saveState = (state) => {
	try {
		//Only Keep States with Small Amounts of Data and Importance to Not Overload Local Storage Between Refreshes
		var state_to_serialize = {}
		for(var i = 0; i<serialized_states_to_keep.length; i++){
			const name = serialized_states_to_keep[i]
			if(state[name] !== undefined){
				state_to_serialize[name] = state[name]
			}
		}
		const serializedState = JSON.stringify(state_to_serialize)
		localStorage.setItem('state', serializedState)
	} catch(err){
		console.log('Error Saving Serialized State')
		console.log(err)
	}
}