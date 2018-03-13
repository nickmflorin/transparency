import datetime 
import calendar
from datetime import date, timedelta
from dateutil import relativedelta

def last_day_of_month(month, year):
	last_day = calendar.monthrange(int(year),int(month))[1]
	dt = datetime.date(int(year), int(month), last_day) 
	return dt

def last_day_of_last_month(current):
    first_day = current.replace(day=1)
    prev_month_lastday = first_day - datetime.timedelta(days=1)
    return prev_month_lastday

# Generates End of Month Dates Starting at Current Date and Looking Back Number of Months
def generate_lookback_end_of_month_dates(current, num_months):
	end = last_day_of_month(current.month, current.year)
	
	dates = []
	for i in range(num_months):
		previous = end - relativedelta.relativedelta(months=i)
		dates.append(previous)

	dates.reverse()
	return dates

def generate_end_of_month_dates_between(startDate, endDate, format='datetime'):
	
	try:
		endDate = datetime.datetime.strptime(endDate, '%Y-%m-%d')
		startDate = datetime.datetime.strptime(startDate, '%Y-%m-%d')
	except TypeError:
		pass 
	print 'Generating Lookback Dates'

	endDate = endDate.date()
	startDate = startDate.date()

	current = startDate 
	current = last_day_of_month(current.month, current.year)
	dates = [current]

	while current <= endDate:
		current = current + relativedelta.relativedelta(months=1)
		current = last_day_of_month(current.month, current.year)
		if format == 'tuple':
			dates.append((current.month, current.year))
		else:
			dates.append(current)

	return dates

# Generates End of Month Dates That Are Before Today and In Given Year
# Used for YTD
def generate_end_of_month_dates_for_year():
	dates = []
	today = datetime.date.today()

	for i in range(1,12):
		new_date = last_day_of_month(i, today.year)
		if(new_date < today):
			dates.append(new_date)

	return dates 
	


