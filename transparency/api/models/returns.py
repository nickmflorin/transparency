import sys
sys.dont_write_bytecode = True
import time
import datetime 
from underscore import _

from mongoengine import Document, EmbeddedDocument, fields
import pymongo

from transparency.api import db, utility

class ManagerReturnResult(dict):
	def __init__(self, row):
		super(ManagerReturnResult, self).__init__({})

		self['_id'] = int(row[0])
		self['value'] = 100.0 * float(row[1])

		year = int(row[2])
		month = int(row[3])
		date = utility.dates.last_day_of_month(month, year)

		# Need as Datetime for Mongo DB
		self['date'] = datetime.datetime.combine(date, datetime.datetime.min.time())
		return

class ManagerReturn(EmbeddedDocument):
	date = fields.DateTimeField(required = True)
	value = fields.FloatField(required=True)

	def __str__(self):
		string = self.date.strftime("%Y-%m-%d")
		return 'Return %s on %s' % (self.value, string)

	@staticmethod
	def from_result(result):
		result = ManagerReturnResult(result)
		ret = ManagerReturn(date = result.date, value = result.value)
		return ret

class ManagerReturns(EmbeddedDocument):
	series = fields.ListField(fields.EmbeddedDocumentField(ManagerReturn))

	# Returns Series with Dates Present in Dates List
	def prune(self, dates):
		pruned = []
		for ret in self.series:
			date = ret.date.date()
			if (date.month, date.year) in dates:
				pruned.append(ret)

		self.series = pruned
		return 

	def slice(self, start = None, end = None):
		if len(self.series) != 0:
			if not start:
				start = min([ret.date for ret in self.series])
			if not end:
				end = max([ret.date for ret in self.series])

			dates = utility.dates.generate_end_of_month_dates_between(start, end, format='tuple')
			self.prune(dates)
		return

	# Returns Series with Dates Sliced Between Start and End Dates
	@staticmethod
	def create_slice(model, start = None, end = None):
		if not start and not end:
			raise Exception('Must Provide One of Start Date or End Date to Slice')

		new = ManagerReturns(series = model.series)
		new.slice(start = start, end = end)
		return new
	
	# Only Supporting Multiple Manager Quries for Now
	@staticmethod
	def refresh(managers = []):
		query_batch_size = 2000
		chunks = [managers[x:x+query_batch_size] for x in xrange(0, len(managers), query_batch_size)]

		grouped = {}
		p = db.Progress('Querying {} Batches'.format(len(chunks)),len(chunks))
		for chunk in chunks:
			queryString = """ SELECT f.fundsid, f.fundreturn/100, f.returnyear, f.returnmonth 
						  FROM diligence.dbo.vperformance f 
						  WHERE f.fundreturn IS NOT NULL"""
			queryString += """ AND f.fundsid IN {}""".format(str(tuple([int(mgr['_id']) for mgr in chunk])))

			new_results = db.queryRCG(queryString, title="Returns", db="Diligence.dbo.vPerformance")

			for result in new_results:
				result = ManagerReturnResult(result)

				if not grouped.get(result['_id']):
					grouped[result['_id']] = []

				grouped[result['_id']].append({
				    'date' : result['date'], 
				    'value' : result['value']
				})
			p.update()

		return grouped 



