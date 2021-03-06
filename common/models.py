import sys
sys.dont_write_bytecode = True
import datetime 

from mongoengine import Document, EmbeddedDocument, fields
from dateutil import relativedelta

from utility import dates 

class Range(EmbeddedDocument):
	start = fields.DateTimeField(required = False)
	end = fields.DateTimeField(required = False)
	empty = fields.BooleanField(default = False)
	__attrs__ = ['start','end']

	def string_dict(self):
		date_dict = {}
		for key in Range.__attrs__:
			value = getattr(self, key)
			if value:
				date_dict[key] = stringify(value)
		return date_dict

	def __str__(self):
		dates = self.string_dict()
		return '%s to %s' % (dates.get('start','-'), dates.get('end','-'))

	@property
	def complete(self):
		if self.start and self.end:
			return True 
		return False 

	@property
	def singular(self):
		if self.start == self.end:
			return True 
		return False 

	@property
	def valid(self):
		if self.start and self.end:
			if self.start > self.end:
				return False 
		return True 

	def validate(self):
		if not self.valid:
			raise Exception('Range Start Date Must Be Before End Date')

	def around_date(self, date):
		date = dates.last_day_of_month(date = date)
		if self.end:
			end_eomonth = dates.last_day_of_month(date = self.end)
			if date > end_eomonth:
				return False

		if self.start:
			start_eomonth = dates.last_day_of_month(date = self.start)
			if date < start_eomonth:
				return False

		return True

	def get_month_series(self, start_add_in = None, end_add_in = None):
		if not self.start:
			if not start_add_in:
				raise Exception('Range Must Have End Points to Create Series')
			start = dates.last_day_of_month(date = start_add_in)
		else:
			start = dates.last_day_of_month(date = self.start)

		if not self.end:
			if not end_add_in:
				raise Exception('Range Must Have End Points to Create Series')
			start = dates.last_day_of_month(date = end_add_in)
		else:
			end = dates.last_day_of_month(date = self.end)

		dates = []
		while start <= end:
			dates.append(start)
			start = start + relativedelta.relativedelta(months=1)
			start = dates.last_day_of_month(date = start)

		return dates 

	# Creates a New Range at End Date Looking Back Specified Amount of Time
	def at_lookback(self, lookback):
		if lookback < 2:
			raise Exception('Lookback Must be > 2')

		if not self.end:
			raise Exception('Cannot Generate Lookback Range Without Initial End Date')

		# Generates End of Month Dates Starting at Current Date and Looking Back Number of Months
		end = dates.last_day_of_month(date = self.end)
		start = end - relativedelta.relativedelta(months=lookback - 1)

		range_ = Range(start = start, end = end)
		range_.validate()
		return range_
	
	def clear(self):
		self.end = None 
		self.start = None 
		self.empty = True 

	# Given Another Range, Restricts This Ranges Start and End Dates
	def restrict(self, range):
		range.validate()

		if self.end and range.start:
			if range.start > self.end:
				self.clear()

		elif self.start and range.end:
			if range.end < self.start:
				self.clear()

		if not self.empty:
			if range.start:
				if not self.start:
					self.start = range.start 
				else:
					if range.start > self.start:
						self.start = range.start 

			if range.end:
				if not self.end:
					self.end = range.end 
				else:
					if range.end < self.end:
						self.end = range.end 

			self.validate()
		return

	@staticmethod
	def ytd_range(year = None):
		dates = []

		today = datetime.datetime.now()
		if not year: year = today.year 

		for i in range(1,12):
			new_date = dates.last_day_of_month(month = i, year = year)
			if(new_date < today):
				dates.append(new_date)

		range_ = Range(start = min(dates), end = max(dates))
		return range_

	