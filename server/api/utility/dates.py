import datetime 
import calendar

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
	dates = []
	end = current

	for i in range(num_months):
		lookback = last_day_of_last_month(end)
		end = last_day_of_last_month(end)
		dates.append(end)

	dates.reverse()
	return dates

# Generates End of Month Dates That Are Before Today and In Given Year
# Used for YTD
def generate_end_of_month_dates_for_year():
	dates = []
	today = datetime.date.today()

	for i in range(1,12):
		date = last_day_of_month(i, today.year)
		if(date < today):
			dates.append(date)

	return dates 
	


