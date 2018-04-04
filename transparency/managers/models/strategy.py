import sys
sys.dont_write_bytecode = True
from mongoengine import Document, EmbeddedDocument, fields
from django.core.cache import cache
from rest_framework import serializers, response, filters, viewsets

import time 
import datetime 
import transparency.db as db
from process import StrategyAssignmentResult, StrategyResult, SubStrategyResult

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

	

	
