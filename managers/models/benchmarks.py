import sys
sys.dont_write_bytecode = True
from mongoengine import Document, EmbeddedDocument, fields
from underscore import _ 

from pymongo import UpdateOne, InsertOne, DeleteMany
from pymongo.errors import BulkWriteError
import pymongo
import pandas as pd 

import db
import common.utility as utility

from process import PortfolioBenchmarkResult
from manager import Manager

class PortfolioBenchmarkAddition(EmbeddedDocument):
	manager = fields.ReferenceField(Manager)
	addition = fields.FloatField(required = True, default = 0.0)
	redemption = fields.FloatField(required = True, default = 0.0)

class PortfolioBenchmark(Document):

	id = fields.IntField(primary_key = True, required=True)
	date = fields.DateTimeField(required = True)
	name = fields.StringField(required=True)
	additions = fields.EmbeddedDocumentListField(PortfolioBenchmarkAddition)

	database = 'Research.dbo.PortfolioBenchmarks'
	def __str__(self):
		return '%s, %s' % (self.id, self.name)

	meta = {
		'collection' : 'benchmarks',
		'indexes': [
			{'fields': ['id', 'date'], 'unique': True },
		],
	}

	class Meta:
		managed = True 
		app_label = 'api'

	@staticmethod
	def process(results, collection):
		
		formatted = []
		for raw in results:
			result = PortfolioBenchmarkResult(raw)
			formatted.append(result)

		ids = list(set([a.manager_id for a in formatted]))
		managers = list(database['managers'].find({
		    '_id' : { '$in' : ids},                          
		}))

		noted = []
		p = utility.progress.Progress('Processing Portfolio Benchmark Results', len(formatted))
		grouped = []
		for result in formatted:
			group = _.findWhere(grouped, { '_id' : result.id })
			if not group:
				group = {
					'_id' : result.id,
					'name' : result.name,
					'date' : result.date,
					'additions' : [],
				}

			addition = {
				'addition' : result.addition, 
				'redemption' : result.redemption,
			}

			addition['manager'] = _.findWhere(managers, {'_id' : result.manager_id})
			if not addition['manager']:
				if result.manager_id not in noted:
					noted.append(result.manager_id)
					print 'Warning: Manager {} Missing for Fund Benchmark {}'.format(result.manager_id, result.id)
			else:
				group['additions'].append(addition)
				grouped.append(group)
			p.update()
		return grouped

	@staticmethod
	def get_query_string():
		queryString = """
			SELECT TranDate, RCGFundID, RCGFundName, ManagerID, Additions, Redemptions
			FROM Research.dbo.PortfolioBenchmarks"""
		return queryString

	@staticmethod
	def refresh():

		client = pymongo.MongoClient("localhost", 27017, maxPoolSize=50)

		print 'Removing Existing Portfolio Benchmark Objects'
		database['benchmarks'].remove({})
		
		queryString = PortfolioBenchmark.get_query_string()
		results = db.queryRCG(queryString, title="Benchmarks", db=PortfolioBenchmark.database, notify=False, timer=False)
		grouped = PortfolioBenchmark.process(results, database)

		print 'Saving {} Portfolio Benchmarks'.format(len(grouped))
		database['benchmarks'].insert(grouped)
		return
