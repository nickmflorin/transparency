import sys
sys.dont_write_bytecode = True
from underscore import _
import time
import datetime 

from pymongo.read_preferences import ReadPreference    
from mongoengine import Document, EmbeddedDocument, DynamicEmbeddedDocument, fields
import pymongo

import transparency.utility as utility 
import transparency.db as db 

from manager import Manager
from process import ManagerExposureResult

class ManagerExposure(Document):

	manager_id = fields.IntField(required = True)
	date = fields.DateTimeField(required = True)
	tier = fields.StringField(required = True, choices = ['long','short','gross','net','pct_gross'])
	value = fields.FloatField(default=0.0)

	class Meta:
		managed = True 
		app_label = 'api'

	meta = {
		'collection' : 'exposures',
		'ordering': ['-date'],
		'indexes': [
			{'fields': ['date', 'manager_id', 'tier'], 'unique': True },
			{'fields': ['date', 'manager_id'] },
			{'fields': ['manager_id'] },
		],
	}

# To Do: Exposure Groupings Currently Setup as Having Individual Exposures Stored Separately... Might Want to Group in Database So These Work
# / Are More Consistent with New Serializer Method
class ManagerExposures(Document):
	id = fields.IntField(required = True)
	exposures = fields.ListField(fields.ReferenceField(ManagerExposure))

	meta = {
		'collection' : 'grouped_exposures',
	}

	@staticmethod
	def process(results):
		exposures = []
		p = utility.progress.Progress('Processing {} Results'.format(len(results)),len(results))
		for result in results:
			result = ManagerExposureResult(result)
			p.update()

			# Ignores Unwanted Categories and Invalid Tiers
			if result.valid:
				exposure = {
				    'manager_id' : result.id, 
				    'date' : result.date, 
				    'value' : result.value,
				    'tier' : result.tier,
				}
				exposures.append(exposure)
				
		return exposures

	@staticmethod
	def get_query_string(ids):
		queryString = """
			SELECT ManagerID, ReportDate, Tier2, DefaultMeasureFilled
			FROM Risk.dbo.vFactManagerRisk 
			WHERE Tier1 = 'Tier 1 - Exposure' AND IsNull(Category1, '') = '' AND DefaultMeasureFilled IS NOT NULL"""
		
		queryString += """ AND ManagerID IN {}""".format(str(tuple(ids)))
		return queryString

	@staticmethod
	def refresh():
		batch_size = 500

		managers = list(Manager._get_collection().find({}))

		chunks = [managers[x:x+batch_size] for x in xrange(0, len(managers), batch_size)]
		for i in range(len(chunks)):
			batch_prefix = 'Batch {} / {} : '.format(i+1,len(chunks))
			ids = [int(manager['_id']) for manager in chunks[i]]

			print batch_prefix + 'Clearing Existing Manager Exposures...'
			ManagerExposure._get_collection().remove({
			    'manager_id' : { '$in' : ids},                              
			})
			print batch_prefix + 'Querying Exposures from Transparency'

			queryString = ManagerExposures.get_query_string(ids)
			results = db.queryRCG(queryString, title="Exposures", db="Diligence.dbo.vFactManagerRisk", notify=False, timer=False)
			exposures = ManagerExposures.process(results)

			if len(exposures) != 0:
				print batch_prefix + 'Saving {} Exposures for {} Managers...'.format(len(exposures), len(ids))
				ManagerExposure._get_collection().insert(exposures)

		return 



	