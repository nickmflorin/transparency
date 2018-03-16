import sys
sys.dont_write_bytecode = True
from mongoengine import Document, EmbeddedDocument, fields

from pymongo import UpdateOne, InsertOne, DeleteMany
from pymongo.errors import BulkWriteError
import pandas as pd 

import transparency.db as db
from results import ManagerBenchmarkResult

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
			for result in results:
				assignment = ManagerBenchmarkResult(result)
				assignments[assignment['id']] = assignment['benchmarks']

		return assignments



