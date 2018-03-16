import sys
sys.dont_write_bytecode = True
import datetime 

from mongoengine import Document, EmbeddedDocument, fields
import transparency.utility as utility
from dateutil import relativedelta

class Range(EmbeddedDocument):
	date = fields.DateTimeField(required = False)
	start = fields.DateTimeField(required = False)
	end = fields.DateTimeField(required = False)

	@property
	def outside(self):
		return self.start is None and self.end is None 

	@property
	def missing(self):
		if self.start is None and self.end is None:
			if self.date is None:
				return True 
		
		return False

	def validate(self):
		if (self.start and self.date) or (self.end and self.date):
			raise Exception('Range Cannot Contain Both Interval Endpoints and As Of Date')
		if self.start and self.end and self.start > self.end:
			raise Exception('Range Start Date Must be Before Range End Date')

	# Given Another Range, Restricts This Ranges Start and End Dates
	def restrict(self, range):
		if not self.start or not self.end:
			raise Exception('Range Must Have Start and End Specified to Restrict')

		self.validate()
		range.validate()

		if range.start:
			self.start = max(self.start, range.start)

		if range.end or range.date:
			if range.end: self.end = min(self.end, range.end)
			else: self.end = max(self.end, range.date)

		return

	# Range Must Have Start and End Dates
	def generate_series(self, format='datetime'):
		
		start_date = self.start.date()
		end_date = self.end.date()

		current = start_date 
		current = utility.dates.last_day_of_month(current.month, current.year)

		dates = [current]
		while current <= end_date:
			current = current + relativedelta.relativedelta(months=1)
			current = utility.dates.last_day_of_month(current.month, current.year)
			dates.append(current)

		if format == 'tuple':
			dates = utility.dates.tuplify(dates)
		return dates

	# Range Treates Request Date as End Date if Supplied
	@staticmethod
	def from_request(request):
		range_ = Range(start = None, end = None, date = None)
		
		# Setting Date Overrides Date Interval
		if request.GET.get('date'):
			string_date =  request.GET.get('date')
			try:  range_.date = datetime.datetime.strptime(string_date, '%Y-%m-%d')
			except:
				print 'Invalid Date Format Supplied'
				range_.end = date 

		elif request.GET.get('start_date') or request.GET.get('end_date'):
			string_start = request.GET.get('start_date')
			string_end = request.GET.get('end_date')

			try: range_.start = datetime.datetime.strptime(string_start, '%Y-%m-%d')
			except:
				print 'Invalid Start Date Format Supplied'
				range_.start = None 

			try:  range_.end = datetime.datetime.strptime(string_end, '%Y-%m-%d')
			except:
				print 'Invalid End Date Format Supplied'
				range_.end = None 

		return range_ 