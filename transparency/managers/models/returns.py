import sys
sys.dont_write_bytecode = True
import time
import datetime 
from underscore import _

from mongoengine import Document, EmbeddedDocument, fields
import pymongo

import transparency.db as db
import transparency.utility as utility

from results import ManagerReturnResult
from range import Range 

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
	range = fields.EmbeddedDocumentField(Range)

	# Returns Series with Dates Present in Dates List
	def prune(self, dates):
		pruned = self.prune_(dates)
		self.series = pruned[:]
		return 

	def prune_(self, dates):
	
		# Convert to Tuple Format if 
		to_prune_with = dates[:]
		if len(dates) != 0:
			if type(dates[0])==datetime.date:
				to_prune_with = [(a.month, a.year) for a in dates]

		pruned = []
		for ret in self.series:
			date = ret.date.date()
			if (date.month, date.year) in to_prune_with:
				pruned.append(ret)

		return pruned

	def slice(self, start = None, end = None):
		if len(self.series) != 0:
			if not start:
				start = min([ret.date for ret in self.series])
			if not end:
				end = max([ret.date for ret in self.series])

			self.range = Range(start = start, end = end)
			self.range.validate()

			dates = self.range.generate_series(format='tuple')
			self.prune(dates)
		return

	# Returns Series with Dates Sliced Between Start and End Dates
	@staticmethod
	def create_slice(model, range):
		range.validate()
		new = ManagerReturns(series = model.series)

		end = range.end 
		if not range.end:
			end = range.date

		new.slice(start = range.start , end = end)
		return new
	
	# Only Supporting Multiple Manager Quries for Now
	@staticmethod
	def refresh(managers = []):
		query_batch_size = 2000
		chunks = [managers[x:x+query_batch_size] for x in xrange(0, len(managers), query_batch_size)]

		grouped = {}
		p = utility.progress.Progress('Querying {} Batches'.format(len(chunks)),len(chunks))
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



