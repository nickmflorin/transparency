import datetime 
import calendar
from datetime import date, timedelta
from dateutil import relativedelta

def last_day_of_month(month, year):
	last_day = calendar.monthrange(int(year),int(month))[1]
	dt = datetime.date(int(year), int(month), last_day) 
	return dt

def intersect(a, b):

	def convert(date):
		return (date.month, date.year)

	def back_convert(tup):
		return last_day_of_month(tup[0], tup[1])

	a = [convert(ai) for ai in a]
	b = [convert(bi) for bi in b]
	intersection = list(set(a) & set(b))

	return [back_convert(ii) for ii in intersection]

def last_day_of_last_month(current):
    first_day = current.replace(day=1)
    prev_month_lastday = first_day - datetime.timedelta(days=1)
    return prev_month_lastday

def tuplify(dates):
	return [(d.month, d.year) for d in dates]
	
# Generates End of Month Dates Starting at Current Date and Looking Back Number of Months
def generate_lookback_end_of_month_dates(current, num_months):
	end = last_day_of_month(current.month, current.year)
	
	dates = []
	for i in range(num_months):
		previous = end - relativedelta.relativedelta(months=i)
		dates.append(previous)

	dates.reverse()
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
	


