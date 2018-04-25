import json
import dates as dates 
from ..models import Range 

# To Do: Need to Find Standardized Way of Retrieving Groups from AJAX Request
def parse_list(request, key, method = 'GET', default = None):
	
	if method == 'GET':
		data = request.GET.get(key)
	elif method == 'POST':
		data = request.POST.get(key)
		
	if not data:
		key = key + '[]'
		if method == 'POST':
			data = request.POST.getlist(key)
		elif method == 'GET':
			data = request.GET.getlist(key)
	else:
		data = json.loads(data)

	if not data and default != None:
		data = default 
	return data

# For Supplying Single Date
def parse_date(request, eomonth = True):
	date = None
	if request.GET.get('date'):
		string_date =  request.GET.get('date')
		date = dates.parse(string_date)
		if eomonth:
			date = dates.last_day_of_month(date = date)
	return date 

# Range Treates Request Date as End Date if Supplied
def parse_range(request):
	range_ = Range(start = None, end = None)
	
	if request.GET.get('date') and (request.GET.get('end_date') or request.GET.get('start_date')):
		raise Exception('Cannot Supply Both Date and Either Start or End Date')

	# Setting Date Overrides Date Interval
	if request.GET.get('date'):
		string_date =  request.GET.get('date')
		range_.end = dates.parse(string_date)
	
	elif request.GET.get('start_date') or request.GET.get('end_date'):
		string_start = request.GET.get('start_date')
		if string_start:
			range_.start = dates.parse(string_start)

		string_end = request.GET.get('end_date')
		if string_end:
			range_.end = dates.parse(string_end)

	return range_ 