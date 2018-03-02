import sys
sys.dont_write_bytecode = True
from mongoengine import Document, EmbeddedDocument, fields

from pymongo import UpdateOne, InsertOne, DeleteMany
from pymongo.errors import BulkWriteError
import pandas as pd 

from server.api import db

class ManagerBenchmarkResult(dict):
	def __init__(self, row):
		super(ManagerBenchmarkResult, self).__init__({})

		self['id'] = int(row[0])
		self['benchmarks'] = []
		if row[1]:
			self['benchmarks'].append(int(row[1]))
		if row[2]:
			self['benchmarks'].append(int(row[2]))
		return

class ManagerBenchmarks(object):

	# TO Do: Need to Validate That Each Peer ID Exists for a Manager in the Database
	@staticmethod
	def query(managers):
		chunks = [managers[x:x+1000] for x in xrange(0, len(managers), 1000)]

		assignments = {}
		for chunk in chunks:
			queryString = """SELECT fundsid, hedgefundbenchmarkid, marketbenchmarkid
				FROM diligence.dbo.funds f
				WHERE fundsid IS NOT NULL AND fundsid IN {}""".format(str(tuple([int(mgr['_id']) for mgr in chunk])))

			results = db.queryRCG(queryString, title="Benchmarks", db="Diligence.dbo.Funds")
			print 'Found {} Results'.format(len(results))
			
			for result in results:
				assignment = ManagerBenchmarkResult(result)
				assignments[assignment['id']] = assignment['benchmarks']

		return assignments


