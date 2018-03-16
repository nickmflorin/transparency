import sys
sys.dont_write_bytecode = True
from underscore import _
import time
import datetime 

from mongoengine import Document, EmbeddedDocument, DynamicEmbeddedDocument, fields
import pymongo
import transparency.utility as utility 
import transparency.db as db 

from results import ManagerExposureResult

class ManagerCategoryExposurePoint(EmbeddedDocument):
	name = fields.StringField(required = True) # Asset Class, Sector, etc.
	gross = fields.FloatField(default=0.0)
	pct_gross = fields.FloatField(default=0.0)
	net = fields.FloatField(default=0.0)
	long = fields.FloatField(default=0.0)
	short = fields.FloatField(default=0.0)

class ManagerCategoryExposure(EmbeddedDocument):
	type = fields.StringField(required = True) # Asset Class, Sector, etc.
	exposures = fields.EmbeddedDocumentListField(ManagerCategoryExposurePoint)

class ManagerExposure(Document):
	manager_id = fields.IntField(required=True) # Manager ID
	date = fields.DateTimeField(required = True)
	categories = fields.EmbeddedDocumentListField(ManagerCategoryExposure)

	gross = fields.FloatField(default=0.0)
	pct_gross = fields.FloatField(default=0.0)
	net = fields.FloatField(default=0.0)
	long = fields.FloatField(default=0.0)
	short = fields.FloatField(default=0.0)

	meta = {
		'collection' : 'exposures',
		'ordering': ['-date'],
		'indexes': [
			{'fields': ['date','manager_id'], 'unique': True },
		],
	}

	class Meta:
		managed = True 
		app_label = 'api'

	# Only Filters Exposures Two Layers Deep for Now
	@staticmethod
	def process(results):
		exposures = []
		p = utility.progress.Progress('Processing {} Results'.format(len(results)),len(results))
		for result in results:
			result = ManagerExposureResult(result)
			p.update()

			# Ignores Unwanted Categories and Invalid Tiers
			if result.valid:
				exposure = filter(lambda exp: exp['manager_id'] == result.id and exp['date'] == result.date, exposures)
				if len(exposure) == 0:
					exposure = {
						'date' : result.date, 
						'manager_id' : result.id,  
						'categories' : [],
						'gross' : 0.0,
						'net' : 0.0,
						'pct_gross': 0.0,
						'long' : 0.0,
						'short' : 0.0
					}
					exposures.append(exposure)
				else:
					exposure = exposure[0]

				if result.level == 0:
					exposure[result.tier] = result.value
				else:
					if result.level == 1:
						tp = result.categories[1]
						name = result.categories[2]
				
						category = filter(lambda cat: cat['type'] == tp, exposure['categories'])
						if len(category) == 0:
							category = { 'type' : result.categories[1], 'exposures' : [] }
							exposure['categories'].append(category)
						else:
							category = category[0]

						point = filter(lambda pt: pt['name'] == name, category['exposures'])
						if len(point) == 0:
							point = { 
								'name' : name,
								'gross' : 0.0,
								'net' : 0.0,
								'pct_gross': 0.0,
								'long' : 0.0,
								'short' : 0.0
							}
							category['exposures'].append(point)
						else:
							point = point[0]
						point[result.tier] = result.value
		return exposures

	# Only Supporting Multiple Manager Quries for Now
	@staticmethod
	def refresh(managers = [], save = True):
		query_batch_size = 200
		bulk_size = 1000
		managers = managers[:2000]
		client = pymongo.MongoClient("localhost", 27017, maxPoolSize=50)
		database = client['peers']
		collection = database['exposures']

		print 'Clearing Existing Manager Exposures..'
		collection.remove({})
		print 'Finished Clearing Existing Manager Exposures'

		saved = []
		chunks = [managers[x:x+200] for x in xrange(0, len(managers), 200)]
		for i in range(len(chunks)):
			print 'Querying Batch {} Out of {}'.format(i+1,len(chunks))

			queryString = """SELECT f.managerid, f.reportdate, f.Tier1, f.Tier2, f.Category1, f.Category2, f.Category3, f.Category4, f.defaultmeasurefilled
			 FROM Risk.dbo.vFactManagerRisk f 
			 WHERE f.Tier1 = 'Tier 1 - Exposure' AND f.defaultmeasurefilled IS NOT NULL"""
			queryString += """ AND f.managerid IN {}""".format(str(tuple([int(mgr.id) for mgr in chunks[i]])))

			results = db.queryRCG(queryString, title="Exposures", db="Diligence.dbo.vFactManagerRisk", notify=False, timer=False)

			# We Dont Have to Use Consistent Currenet Set of Exposures Between Processes Since We Query by New Manager IDs Each Time
			exposures = ManagerExposure.process(results)

			ids = list(set([exp['manager_id'] for exp in exposures]))
			if any(id in saved for id in ids):
				print 'Duplicate IDS Found'
				import pdb; pdb.set_trace()

			saved.extend(ids)
			print 'Saving {} Exposures for {} Managers...'.format(len(exposures), len(chunks[i]))
			collection.insert(exposures)

		return exposures
		
	


