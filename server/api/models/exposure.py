import sys
sys.dont_write_bytecode = True
from underscore import _

import time
import datetime 

from mongoengine import Document, EmbeddedDocument, DynamicEmbeddedDocument, fields
import pymongo

from server.api import db
from server.api import utility

class ExposureSettings:
	Tier1 = 'Tier 1 - Exposure'
	Tiers = {
		 'Economic Net Exposure':'net',
		 'Economic Gross Exposure':'gross',
		 '% Gross Exposure':'pct_gross',
		 'Economic Long Exposure':'long',
		 'Economic Short Exposure': 'short'
	}
	Categories = {
		'Asset Category' : 'asset',
		'Market Cap' : 'market_cap',
		'Sector' : 'sector',
		'Region' : 'region',
		'Strategy' : 'strategy',
		'Currency' : 'currency'
	}

	@staticmethod 
	def convert_tier(tier):
		return ExposureSettings.Tiers.get(tier, 'invalid')

	@staticmethod 
	def convert_category(category):
		# This Will Happen for Categories That We Do Not Want
		if not ExposureSettings.Categories.get(category):
			return 'invalid'

		return ExposureSettings.Categories[category]

class ManagerExposureResult(dict):
	def __init__(self, row):
		super(ManagerExposureResult, self).__init__({})

		self['auto_invalid'] = False
		self['_id'] = int(row[0])

		self['date'] = row[1]
		self['date'] = utility.dates.last_day_of_month(self['date'].month, self['date'].year)
		self['date'] = datetime.datetime.combine(self['date'], datetime.datetime.min.time())

		self['tier'] = ExposureSettings.convert_tier(str(row[3]))

		try:
			self['value'] = float(row[8])
		except TypeError:
			print 'Found Invalid Value {} in Exposure Result'.format(row[8])
			self['value'] = 0.0
			self['auto_invalid'] = True

		self['categories'] = {
			1 : str(row[4]),
			2 : str(row[5]),
			3 : str(row[6]),
			4 : str(row[7])
		}

		if self['categories'][1]:
			self['categories'][1] = ExposureSettings.convert_category(self['categories'][1])

		self['level'] = 4 # Default
		if not self['categories'][1]:
			self['level'] = 0
		elif not self['categories'][2]:
			self['level'] = 1
		elif not self['categories'][3]:
			self['level'] = 2
		elif not self['categories'][4]:
			self['level'] = 3
		return

	def category(self, level):
		return self['categories'][level]

	@property
	def valid(self):
		if self['tier'] != 'invalid' and self['categories'][1] != 'invalid':
			if not self['auto_invalid']:
				return True 
		return False 

class ManagerExposure(EmbeddedDocument):

	level = fields.IntField(required=True)
	name = fields.StringField(required = True)
	parent = fields.StringField(required = False)

	gross = fields.FloatField(default=0.0)
	pct_gross = fields.FloatField(default=0.0)
	net = fields.FloatField(default=0.0)
	long = fields.FloatField(default=0.0)
	short = fields.FloatField(default=0.0)

class ManagerDatedExposure(EmbeddedDocument):

	date = fields.DateTimeField(required = True)
	exposures = fields.EmbeddedDocumentListField(ManagerExposure)

	gross = fields.FloatField(default=0.0)
	pct_gross = fields.FloatField(default=0.0)
	net = fields.FloatField(default=0.0)
	long = fields.FloatField(default=0.0)
	short = fields.FloatField(default=0.0)

class ManagerExposures(Document):

	_id = fields.IntField(required=True, primaryKey = True) # Manager ID
	series = fields.EmbeddedDocumentListField(ManagerDatedExposure)

	meta = {
		'collection' : 'exposures',
		'restricted' : True,
		'__categories__' : ['asset','market_cap','region','sector','strategy','currency'],
		'level' : 1
	}

	# Only Supporting Multiple Manager Quries for Now
	@staticmethod
	def refresh(managers = [], save = True):
		query_batch_size = 1000
		process_batch = 1000

		client = pymongo.MongoClient("localhost", 27017, maxPoolSize=50)
		database = client['peers']
		collection = database['exposures']

		# Create Initial Exposures for Missing Points 
		p = db.Progress('Defaulting Missing Manager Exposures',len(managers))
		for manager in managers:
			exposure = ManagerExposures.objects.filter(_id = manager['_id']).first()
			p.update()

			if not exposure:
				exposure = ManagerExposures(_id = manager['_id'], series = [])
				exposure.save()

		chunks = [managers[x:x+query_batch_size] for x in xrange(0, len(managers), query_batch_size)]
		results = []

		p = db.Progress('Querying {} Batches'.format(len(chunks)),len(chunks))
		for i in range(len(chunks)):
			queryString = """SELECT f.managerid, f.reportdate, f.Tier1, f.Tier2, f.Category1, f.Category2, f.Category3, f.Category4, f.defaultmeasurefilled
			 FROM Risk.dbo.vFactManagerRisk f 
			 WHERE f.Tier1 = 'Tier 1 - Exposure' AND f.defaultmeasurefilled IS NOT NULL"""
			queryString += """ AND f.managerid IN {}""".format(str(tuple([int(mgr['_id']) for mgr in chunks[i]])))

			new_results = db.queryRCG(queryString, title="Exposures", db="Diligence.dbo.vFactManagerRisk", notify=False, timer=False)
			results.extend(new_results)
		
			p.update()
		
		grouped = [{'_id' : mgr['_id'], 'series' : []} for mgr in managers]
		grouped = ManagerExposures.process(grouped, results)

		print 'Saving Exposures for {} Managers...'.format(len(grouped))
		bulk = collection.initialize_unordered_bulk_op()

		for group in grouped:
			bulk.find({'_id': group['_id']}).update({
				'$set': {'series' : group['series']}
			})
		
		bulk.execute()
		print 'Done'
		return grouped
		
	@staticmethod
	def process(grouped, results):

		p = db.Progress('Processing {} Results'.format(len(results)),len(results))
		for result in results:
			result = ManagerExposureResult(result)
			p.update()

			# Ignores Unwanted Categories and Invalid Tiers
			if result.valid:

				# Initialized With Group Ahead of Time
				group = _.findWhere(grouped, {'_id' : result['_id']})
				dated = _.findWhere(group['series'], {'date' : result['date']})
				if not dated:
					dated = {
						'date' : result['date'], 
						'exposures' : [],
						'gross': 0.0,
						'long': 0.0,
						'short': 0.0,
						'net': 0.0,
						'pct_gross': 0.0,
					}
					group['series'].append(dated)

		
				# No Point in Storing Exposure Totals for General Asset Category, Sector Category etc... These Should be Same as Manager Exposures
				if result['level'] == 0:
					dated[result['tier']] = result['value']

				elif result['level'] != 1:
					exposure = _.findWhere(dated['exposures'], {'level' : result['level'], 'name' : str(result['categories'][result['level']])})
					if not exposure:
						exposure = {
							'level' : int(result['level']),
							'name' : str(result['categories'][result['level']]),
							'parent' : None,
							'gross': 0.0,
							'long': 0.0,
							'short': 0.0,
							'net': 0.0,
							'pct_gross': 0.0,
						}
						dated['exposures'].append(exposure)

					if result['level'] > 1:
						exposure['parent'] = result['categories'][result['level'] - 1]
					exposure[result['tier']] = result['value']
		return grouped



