import datetime 
import calendar
from datetime import date, timedelta
from dateutil import relativedelta

def tuplifi(date):
	return (d.month, d.year)

def tuplify(dates):
	return [tuplifi(d) for d in dates]

# Returns Date in DATETIME Format... Not Date -> Important to Keep Consistent
def last_day_of_month(month = None, year = None, date = None,):
	missing_month = not month and month != 0 
	missing_year = not year and year != 0 

	if not date and (missing_year or missing_month):
		raise Exception('Must Specify Either Year & Month or Date')

	if date:
		month = date.month 
		year = date.year 

	last_day = calendar.monthrange(int(year),int(month))[1]
	dt = datetime.date(int(year), int(month), last_day) 
	return datetime.datetime.combine(dt, datetime.datetime.min.time())

def stringify(date):
	return date.strftime("%Y-%m-%d")

# Returns Date in DATETIME Format... Not Date -> Important to Keep Consistent
def parse(string):
	try:  
		return datetime.datetime.strptime(string, '%Y-%m-%d')
	except:
		print 'Invalid Date Format Supplied'
		return None 

def intersect(a, b):

	def convert(date):
		return (date.month, date.year)

	def back_convert(tup):
		return last_day_of_month(tup[0], tup[1])

	a = [convert(ai) for ai in a]
	b = [convert(bi) for bi in b]
	intersection = list(set(a) & set(b))

	return [back_convert(ii) for ii in intersection]


