def calculate_total_return(values):
	ret = 1.0
	for val in values:
		ret = (1.0 + val) * ret 
	return ret