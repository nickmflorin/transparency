import sys
sys.dont_write_bytecode = True
import time
import datetime 
from underscore import _

from mongoengine import Document, EmbeddedDocument, fields
import pymongo

from server.api import db
from server.api import utility

class ManagerReturnResult(dict):
	def __init__(self, row):
		super(ManagerReturnResult, self).__init__({})

		self['_id'] = int(row[0])
		self['value'] = float(row[1])

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

class ManagerReturns(Document):
	_id = fields.IntField(required=True, primaryKey = True) # Manager ID
	series = fields.ListField(fields.EmbeddedDocumentField(ManagerReturn))

	meta = {
		'collection' : 'returns',
	}

	# Only Supporting Multiple Manager Quries for Now
	@staticmethod
	def refresh(managers = []):
		grouped = {}
		query_batch_size = 2000

		client = pymongo.MongoClient("localhost", 27017, maxPoolSize=50)
		database = client['peers']
		collection = database['returns']

		# Create Initial Exposures for Missing Points 
		p = db.Progress('Defaulting Missing Manager Returns',len(managers))
		for manager in managers:
			returns = ManagerReturns.objects.filter(_id = manager['_id']).first()
			p.update()

			if not returns:
				returns = ManagerReturns(_id = manager['_id'], series = [])
				returns.save()

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

		print 'Saving Returns for {} Managers...'.format(len(grouped))
		bulk = collection.initialize_unordered_bulk_op()

		for id, series in grouped.items():
			bulk.find({'_id': id}).update({
				'$set': {'series' : series}
			})
		
		bulk.execute()
		print 'Done'
		return 


