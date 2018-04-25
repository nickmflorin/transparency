import sys
sys.dont_write_bytecode = True
from multiprocessing import Pool, Process

from django.utils import encoding
from pprint import pprint
from pymongo import InsertOne, DeleteMany, ReplaceOne, UpdateOne

from underscore import _ 
import pymongo

import db
import common.utility as utility

from results import StrategyAssignmentResult, ManagerReturnResult, ManagerBenchmarkResult, ManagerPeerResult

def ManagerProcessQuery(type, ids, title = None, db_name = None, formatter = None):
	queries = {
		'benchmarks' : 
			"""
			SELECT fundsid, hedgefundbenchmarkid, marketbenchmarkid
			FROM diligence.dbo.funds f
			WHERE fundsid IS NOT NULL AND fundsid IN {}
			""",
		'peers' : 
			"""
			SELECT DISTINCT p.GroupId, f.FundsId
			FROM Diligence.dbo.PeerCoreList p
			LEFT OUTER JOIN Diligence.dbo.PeerListxFund px
			ON p.id = px.listid
			LEFT OUTER JOIN Diligence.dbo.Funds f
			ON px.fundsid = f.FundsId
			WHERE ISNUMERIC(p.GroupId)=1 AND f.FundsId IN {}
			""",
		'returns' : 
			""" 
			SELECT f.FundsId, f.FundReturn/100, f.ReturnYear, f.ReturnMonth 
		    FROM Diligence.dbo.vPerformance f 
		    WHERE f.FundReturn IS NOT NULL AND f.FundsId IN {}
		   	""",
		'substrategies':
			"""
			SELECT FundsID, Strategy2EnumID FROM Diligence.dbo.Funds
			WHERE FundsID IN {} AND Strategy2EnumID IS NOT NULL
			""",
		'strategies':
			"""
			SELECT FundsID, StrategyEnumID FROM Diligence.dbo.Funds
			WHERE FundsID IN {} AND Strategy2EnumID IS NOT NULL
			""",
	}

	query = queries.get(type)
	if not query:
		raise Exception('Invalid Type')
	query = query.format(str(tuple(ids)))

	results = db.queryRCG(query, title=title, db=db_name, notify = False, timer = False)
	if formatter:
		results = [formatter(result) for result in results]
	return results

class ManagerProcess:
	def __init__(self, batch, num, total):
		self.batch = batch
		self.num = num 
		self.total = total 
		self.size = len(self.batch)

		self.batch_prefix = 'Batch {} / {} : '.format(num,total)
		self.ids = [int(result[0]) for result in self.batch]

		return

	def process(self):
		client = pymongo.MongoClient("localhost", 27017, maxPoolSize=50)
		ref = client['peers']

		self.process_managers(ref)
		self.assign_strategies(ref)
		self.assign_sub_strategies(ref)
		self.assign_benchmarks(ref)
		self.assign_peers(ref)
		self.assign_returns(ref)
		#self.post_clean(ref)
		return

	# Cleans by Defaulting Any Missing Fields to Correlate to Models
	def post_clean(self, ref):
		managers = list(ref.managers.find({'_id':{'$in':self.ids}}))
		print self.batch_prefix + 'Performing Final Clean for {} Managers'.format(len(managers))

		for manager in managers:
			if not manager.get('returns') or manager['returns'] == []:
				print 'Defaulting Returns for Manager {}'.format(manager['_id'])
				ref.managers.update({ '_id' : manager['_id'] }, { '$set' : {
				       'returns' :  { 'series' : [] }
				}})
		return

	def process_managers(self, ref):
		to_insert = []
		print self.batch_prefix + 'Processing {} Results'.format(self.size)

		for result in self.batch:
			manager = {
				'_id' : int(result[0]),
				'name' : encoding.smart_str(result[1], encoding='ascii', errors='ignore'),
			}

			existing = ref.managers.find_one({ '_id' : manager['_id'] })
			if not existing:
				print 'Found New Manager {}'.format(manager['_id'])

				manager['peers'] = []
				manager['benchmarks'] = []
				manager['returns'] = { 'series' : [] }
				to_insert.append(manager)
			else:
				if existing['name'] != manager['name']:
					print 'Updating Manager {} Name {} -> {}'.format(manager['_id'], existing['name'], manager['name'])
					ref.managers.update({ '_id' : manager['_id'] }, { '$set' : {
					      'name' : manager['name']
					}})

		if len(to_insert) != 0:
			print self.batch_prefix + 'Inserting {} New Managers'.format(len(to_insert))
			ref.managers.insert(to_insert)
		return 

	def assign_peers(self, ref):
		print self.batch_prefix + 'Updating Manager Peers...'
		grouped = {}

		results = ManagerProcessQuery('peers', self.ids, title = 'Peers', db_name = 'Diligence.dbo.Funds', formatter=ManagerPeerResult)
		for result in results:
			manager = ref.managers.find_one({'_id' : result['_id']})
			if not manager:
				raise Exception('Manager Should be Present Since Results Were Filtered for Present Manager IDs')

			if not grouped.get(result['_id']):
				grouped[result['_id']] = []

			exists = ref.managers.find_one({'_id' : result['peer_id']})
			if not exists:
				print 'Warning: Peer {} for Manager {} Does Not Exist'.format(result['peer_id'], result['_id'])
			else:
				grouped[result['_id']].append(result['peer_id'])

		for id, peers in grouped.items():
			manager = ref.managers.find_one({'_id' : id})
			if not manager:
				raise Exception('Manager Should be Present Since Results Were Filtered for Present Manager IDs')

			current = manager.get('peers', [])
			altered = False 
			for peer_id in peers:
				if peer_id not in current:
					print 'Inserting New Peer {} for Manager {}'.format(peer_id, manager['_id'])
					altered = True

			for peer_id in current:
				if peer_id not in peers:
					print 'Removing Peer {} for Manager {}'.format(peer_id, manager['_id'])
					altered = True

			if altered:
				ref.managers.update({'_id' :  manager['_id']}, {'$set' : {
				    'peers' : peers,
				}})
			return 

	def assign_benchmarks(self, ref):
		print self.batch_prefix + 'Updating Manager Benchmarks...'

		results = ManagerProcessQuery('benchmarks', self.ids, title = 'Benchmarks', db_name = 'Diligence.dbo.Funds', formatter=ManagerBenchmarkResult)
		for result in results:
			manager = ref.managers.find_one({'_id' : result['_id']})
			if not manager:
				raise Exception('Manager Should be Present Since Results Were Filtered for Present Manager IDs')

			# Validate
			if len(result['benchmarks']) != 0:
				for id in result['benchmarks']:
					mgr = ref.managers.find_one({'_id' : id})
					if not mgr:
						raise Exception('Found Invalid Benchmark ID {}'.format(id))

			current = manager.get('benchmarks', [])
			altered = False 
			for id in result['benchmarks']:
				if id not in current:
					print 'Inserting New Benchmark {} for Manager {}'.format(id, manager['_id'])
					altered = True

			for id in current:
				if id not in result['benchmarks']:
					print 'Removing Benchmark {} for Manager {}'.format(id, manager['_id'])
					altered = True

			if altered:
				ref.managers.update({'_id' :  manager['_id']}, {'$set' : {
				    'benchmarks' : result['benchmarks'],
				}})
			return 

	# Returns Auto Update -> Quicker Than Checking if Each Manager Needs to Have Returns Updated
	def assign_returns(self, ref):
		grouped = {}
		print self.batch_prefix + 'Updating Manager Returns...'

		results = ManagerProcessQuery('returns', self.ids, title = 'Returns', db_name = 'Diligence.dbo.vPerformance', formatter = ManagerReturnResult)
		for result in results:

			if not grouped.get(result['_id']):
				grouped[result['_id']] = []

			grouped[result['_id']].append({
			    'date' : result['date'], 
			    'value' : result['value']
			})

		for manager_id, returns in grouped.items():
			ref.managers.update({'_id' : manager_id}, {'$set' : {
			    'returns' :  { 'series' : returns }
			}})
		return

	def assign_sub_strategies(self, ref):
		print self.batch_prefix + 'Updating Manager Sub Strategies...'

		results = ManagerProcessQuery('substrategies', self.ids, title = 'Sub Strategies', db_name = 'Diligence.dbo.Funds', formatter=StrategyAssignmentResult)
		for result in results:

			substrategy = ref.substrategies.find_one({'_id' : result['_id'] })
			if not substrategy:
				print 'Warning: Manager {} Sub Strategy {} Not in Database... Need to Refresh Strategies First'.format(result['manager_id'], result['_id'])
			else:
				manager = ref.managers.find_one({'_id' : result['manager_id']})
				if not manager:
					raise Exception('Manager Should be Present Since Results Were Filtered for Present Manager IDs')

				if not manager.get('substrategy'):
					print 'Inserting Sub Strategy {} for Manager {}'.format(result['_id'], manager['_id'])
					ref.managers.update({'_id' :  manager['_id']}, {'$set' : {
					    'substrategy' : substrategy['_id']
					}})

				else:
					if manager['substrategy'] != substrategy['_id']:
						print 'Manager Sub Strategy Updated {} -> {}'.format(manager['substrategy'], substrategy['_id'])
						ref.managers.update({'_id' :  manager['_id']}, {'$set' : {
						    'substrategy' : substrategy['_id']
						}})
		return 

	def assign_strategies(self, ref):
		print self.batch_prefix + 'Updating Manager Strategies...'

		results = ManagerProcessQuery('strategies', self.ids, title = 'Strategies', db_name = 'Diligence.dbo.Funds', formatter = StrategyAssignmentResult)
		for result in results:

			strategy = ref.strategies.find_one({'_id' : result['_id'] })
			if not strategy:
				print 'Warning: Manager {} Strategy {} Not in Database... Need to Refresh Strategies First'.format(result['manager_id'], result['_id'])
			else:
				manager = ref.managers.find_one({'_id' : result['manager_id']})
				if not manager:
					raise Exception('Manager Should be Present Since Results Were Filtered for Present Manager IDs')

				if not manager.get('strategy'):
					print 'Inserting Strategy {} for Manager {}'.format(result['_id'], manager['_id'])
					ref.managers.update({'_id' :  manager['_id']}, {'$set' : {
					    'strategy' : strategy['_id']
					}})

				else:
					if manager['strategy'] != strategy['_id']:
						print 'Manager Strategy Updated {} -> {}'.format(manager['strategy'], strategy['_id'])
						ref.managers.update({'_id' :  manager['_id']}, {'$set' : {
						    'strategy' : strategy['_id']
						}})
		return 



