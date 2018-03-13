import sys
sys.dont_write_bytecode = True
from mongoengine import Document, EmbeddedDocument, fields
from django.core.cache import cache
from rest_framework import serializers, response, filters, viewsets

import time 
import datetime 
from transparency.api import db

class StrategyAssignmentResult(dict):
	def __init__(self, **kwargs):
		super(StrategyAssignmentResult, self).__init__({})

		self['id'] = kwargs.get('id')
		self['managerID'] = kwargs.get('managerID')
		if not self['id'] or not self['managerID']:
			raise Exception('ID and Manager ID Required')

	@staticmethod
	def from_result(result):
		if result[0] and result[1]:
			return StrategyAssignmentResult(id = int(result[1]), managerID = int(result[0]))
		return None

class StrategyResult(object):
	def __init__(self, row):
		self.id = int(row[0])
		self.name = str(row[1])
		self.code = str(row[2])
		
		# To Do: Turn These Into Related Fields Referencing Our Peers and Benchmarks
		self.hf_benchmarkId = None 
		if row[3]:
			self.hf_benchmarkId = int(row[3])
		
		self.market_benchmarkId = None 
		if row[4]:
			self.market_benchmarkId = int(row[4])
		return

class SubStrategyResult(object):
	def __init__(self, row):
		self.id = int(row[0])
		self.parent_id = int(row[1])
		self.name = str(row[2])
		return

class Strategy(Document):
	id = fields.IntField(primary_key = True, required=True) # ID is Enum ID from DB

	name = fields.StringField(required=True)
	code = fields.StringField(required=True) # Referenced for SQL Database Views
	hf_benchmarkId = fields.IntField()
	market_benchmarkId = fields.IntField()

	meta = {
		'collection' : 'strategies',
	}

	def __str__(self):
		return 'Strategy : %s, %s' % (self.id, self.name)

	# Queries Strategy Assignments for Individual Managers
	@staticmethod 
	def query(managers = []):
		chunks = [managers[x:x+1000] for x in xrange(0, len(managers), 1000)]
		assignments = {}

		for chunk in chunks:
			queryString = """SELECT FundsID, StrategyEnumID FROM Diligence.dbo.Funds"""
			queryString = queryString + """ WHERE FundsID IN {}""".format(str(tuple([int(mgr['_id']) for mgr in chunk])))

			results = db.queryRCG(queryString, title="Strategies", db="Diligence.dbo.Funds")
			for result in results:
				assignment = StrategyAssignmentResult.from_result(result)
				if assignment:
					if assignments.get(assignment['managerID']):
						print 'Warning: Found Multiple Strategy Assignments for Manager {}'.format(assignment['managerID'])
						continue 

					model = Strategy.objects.filter(id = assignment['id']).first()
					if model:
						assignments[assignment['managerID']] = assignment
					else:
						print 'Warning: Strategy {} Not in Database... Need to Refresh Strategies First'.format(assignment['id'])
		
		return assignments

	# Queries and Refreshes Strategy Models 
	@staticmethod 
	def refresh():
		print 'Refreshing Manager Strategies'
		queryString = """SELECT StrategyEnumID, Strategy, StrategyCode, HedgeFundBenchmarkID, MarketBenchmarkID 
						 FROM Diligence.dbo.StrategyEnum"""

		results = db.queryRCG(queryString)
		for result in results:
			result = StrategyResult(result)

			strategy = Strategy.objects.filter(id = result.id).first()
			if strategy:
				if strategy.name != result.name:
					print 'Found New Name For Strategy {}'.format(strategy.id)
					strategy.name = result.name 
					strategy.save()

				if strategy.code != result.code:
					print 'Found New Code For Strategy {}'.format(strategy.id)
					strategy.code = result.code 
					strategy.save()

				if strategy.hf_benchmarkId != result.hf_benchmarkId:
					print 'Found New HF Benchmark ID for Strategy {}'.format(strategy.id)
					strategy.hf_benchmarkId = result.hf_benchmarkId 
					strategy.save()

				if strategy.market_benchmarkId != result.market_benchmarkId:
					print 'Found New Market Benchmark ID for Strategy {}'.format(strategy.id)
					strategy.market_benchmarkId = result.market_benchmarkId 
					strategy.save()

			else:
				print 'Adding New Strategy {} {}, {}'.format(result.id, result.code, result.name)
				strategy = Strategy(id = result.id, code=result.code, name = result.name, hf_benchmarkId = result.hf_benchmarkId, market_benchmarkId = result.market_benchmarkId)		
				strategy.save()
		return

class SubStrategy(Document):

	id = fields.IntField(primary_key = True, required=True) # ID is Enum ID from DB
	name = fields.StringField(required=True)
	parent = fields.ReferenceField(Strategy)

	meta = {
		'collection' : 'substrategies',
	}

	# Queries Strategy Assignments for Individual Managers
	@staticmethod 
	def query(managers = []):
		assignments = {}

		queryString = """SELECT FundsID, Strategy2EnumID FROM Diligence.dbo.Funds"""
		queryString = queryString + """ WHERE FundsID IN {}""".format(str(tuple([int(mgr['_id']) for mgr in managers])))

		results = db.queryRCG(queryString, title="Sub Strategies", db="Diligence.dbo.Funds")
		for result in results:
			assignment = StrategyAssignmentResult.from_result(result)

			if assignment:
				if assignments.get(assignment['managerID']):
					print 'Warning: Found Multiple Sub Strategy Assignments for Manager {}'.format(assignment['managerID'])
					continue 

				model = SubStrategy.objects.filter(id = assignment['id']).first()
				if model:
					assignments[assignment['managerID']] = assignment
				else:
					print 'Warning: Strategy {} Not in Database... Need to Refresh SubStrategies First'.format(assignment['id'])
	
		return assignments

	@staticmethod 
	def refresh():
		print 'Refreshing Manager Sub Strategies'
		queryString = """SELECT Strategy2EnumID, StrategyEnumID, Strategy2
						 FROM Diligence.dbo.Strategy2Enum"""

		results = db.queryRCG(queryString)
		to_save = []
		for result in results:
			result = SubStrategyResult(result)
			substrategy = SubStrategy.objects.filter(id = result.id).first()
			if substrategy:

				if not substrategy.parent and result.parent_id:
					print 'Parent {} Added for Substrategy {result.parent_id}'.format(substrategy.parent.id)
					substrategy.parent = Strategy.objects.filter(id = result.parent_id).first()

					if not substrategy.parent:
						print 'Warning: Parent {} Referenced from SQL DB Not Found in DB'.format(result.parent_id)
					else:
						substrategy.save()

				elif substrategy.parent and not result.parent_id:
					print 'Substrategy {} Parent {} Removed'.format(substrategy.id, substrategy.parent.id)

					substrategy.parent = Strategy.objects.filter(id = result.parent_id).first()
					if not substrategy.parent:
						print 'Warning: Parent {} Referenced from SQL DB Not Found in DB'.format(result.parent_id)
					else:
						substrategy.save()

				if substrategy.name != result.name:
					print 'Found New Name For Sub Strategy {}'.format(substrategy.id)
					substrategy.name = result.name 
					substrategy.save()
			else:
				print 'Adding New Sub Strategy {}, {}'.format(result.id, result.name)
				substrategy = SubStrategy(id=result.id, name = result.name)
				if result.parent_id:
					substrategy.parent = Strategy.objects.filter(id = result.parent_id).first()
					if not substrategy.parent:
						print 'Warning: Parent {} Referenced from SQL DB Not Found in DB'.format(result.parent_id)
				
				substrategy.save()
		return

	

	
