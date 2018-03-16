import sys
sys.dont_write_bytecode = True
import datetime 
import time 
from underscore import _
import unicodedata

from mongoengine import Document, EmbeddedDocument, ReferenceField, fields
import pymongo

from strategy import Strategy, SubStrategy
from returns import ManagerReturns, ManagerReturn
from benchmarks import ManagerBenchmarks 
from peers import ManagerPeers 

class Manager(Document):

	id = fields.IntField(primary_key = True, required=True)
	name = fields.StringField(required=True)
	
	peers = fields.ListField(fields.ReferenceField('self'))
	benchmarks = fields.ListField(fields.ReferenceField('self'))

	# Keep Returns as Embedded Doc so Stats Can be Calculated
	returns = fields.EmbeddedDocumentField(ManagerReturns)
	strategy = fields.ReferenceField(Strategy, required=False)
	substrategy = fields.ReferenceField(SubStrategy, required=False)
	
	database = 'Diligence.dbo.Funds'
	def __str__(self):
		return '%s, %s' % (self.id, self.name)

	meta = {
		'collection' : 'managers',
	}

	class Meta:
		managed = True 
		app_label = 'api'

	@staticmethod
	def query():
		queryString = """ SELECT DISTINCT FundsID, FundName FROM {} ORDER BY FundsID desc""".format(Manager.database)
		results = db.queryRCG(queryString, title="Managers", db=Manager.database)

		if len(results) == 0:
			print 'Error: Did Not Retrieve Any Results from {}'.format(Manager.database)
			return None

		managers = []
		for result in results:
			result = {
				'id' : int(result[0]),
				'name' : result[1]
			}
			result['name'] = result['name'].encode('ascii','ignore')
			manager = Manager(id = result['id'], name = result['name'])
			managers.append(manager)

		return managers 

	# Refreshes Managers in Application DB from Query
	# Here We Might Want to Refresh Returns Separately Before Managers,
	# and Reference Returns from MongoDB Intstead of Returns from SQL Database
	@staticmethod
	def refresh(relationships_only = True):
		print 'Refreshing Managers'
		Manager.refresh_relationships()
		return
		
		queried = Manager.query()
		print 'Retrieved {} Managers from Database'.format(len(queried))

		for queried_mgr in queried:
			queried_mgr.name = queried_mgr.name.encode('ascii','ignore')

			manager = Manager.objects.filter(id = queried_mgr.id).first()
			manager.name = manager.name.encode('ascii','ignore')

			if not manager:
				print 'Adding New Manager {}'.format(queried_mgr.id)
				manager = Manager(id = queried_mgr.id, name = queried_mgr.name)
				manager.save()

			elif manager.name != queried_mgr.name:
				print 'Manager Name {} Updated to {}'.format(manager.name, queried_mgr.name)
				manager.name = queried_mgr.name 
				manager.save()

		Manager.refresh_relationships()
		return

	@staticmethod
	def refresh_relationships():
		print 'Refreshing Manager Relationships'

		client = pymongo.MongoClient("localhost", 27017, maxPoolSize=50)
		db = client['peers']
		collection = db['managers']

		print 'Retrieving Managers'
		managers = list(collection.find({}))

		print 'Retrieving Returns'
		returns = ManagerReturns.refresh(managers = managers)

		print 'Retrieving Benchmarks'
		benchmarks = ManagerBenchmarks.query(managers) 

		print 'Retrieving Peers'
		peers = ManagerPeers.query(managers) 

		print 'Retrieving Strategies'
		strategies = Strategy.query(managers = managers)

		print 'Retrieving Sub Strategies'
		substrategies = SubStrategy.query(managers = managers)

		bulk = collection.initialize_unordered_bulk_op()
		for manager in managers:
			setter = {
				'benchmarks': [], 
				'peers': [], 
				'substrategy' : None,
				'strategy' : None,
				'returns' : {'series' : []},
			}

			if returns.get(manager['_id']):
				setter['returns']['series'] = returns[manager['_id']]

			peers_ = peers.get(manager['_id'], [])
			for id in peers_:
				peerModel = Manager.objects.filter(id = id).first()
				if not peerModel:
					print 'Warning: Found Peer {} for Manager {} That is Not Saved Yet... Dropping'.format(id, manager['_id'])
				else:
					setter['peers'].append(peerModel.id)

			bmarks = benchmarks.get(manager['_id'], [])
			for id in bmarks:
				benchmarkModel = Manager.objects.filter(id = id).first()
				if not benchmarkModel:
					print 'Warning: Found Benchmark {} for Manager {} That is Not Saved Yet... Dropping'.format(id, manager['_id'])
				else:
					setter['benchmarks'].append(benchmarkModel.id)

			setter['strategy'] = strategies.get(manager['_id'])
			if not setter['strategy']:
				print 'Warning: Missing Strategy for Manager {}'.format(manager['_id'])
			else:
				setter['strategy'] = setter['strategy']['id']  

			setter['substrategy'] = substrategies.get(manager['_id'])
			if setter['substrategy']:
				setter['substrategy'] = setter['substrategy']['id'] 

			bulk.find({'_id': manager['_id']}).update({
				'$set': setter
			})

		print 'Executing Bulk Save...'
		bulk.execute()
		print 'Bulk Save Finished...'

		return 

	


	

