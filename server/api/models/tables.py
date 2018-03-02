import sys
sys.dont_write_bytecode = True
from mongoengine import Document, EmbeddedDocument, fields

from pymongo import UpdateOne, InsertOne, DeleteMany
from pymongo.errors import BulkWriteError
import pandas as pd 

from server.api import db

class DatabaseTableResult(object):
	def __init__(self, result):
		self.db = str(result[0])
		self.handle = str(result[1])

		self.name = str(result[2])
		self.id = str(result[2])

		self.type = str(result[3])
		return

# Results from Actual Query of Database
class QueryResults(Document):
	sql = fields.StringField(primary_key = True, required=True)
	table = fields.ReferenceField('DatabaseTable')
	columns = fields.ListField(fields.StringField())
	results = fields.ListField(fields.DynamicField())

	LIMIT = 200

	def retrieve(self, limit = False):
		if not self.sql:
			raise Exception('Cannot Retrieve Results for Missing SQL')

		queried = db.queryRCGReporting(self.sql, columns = True)

		self.columns = queried['columns'] 
		self.results = queried['results'] 
		if limit:
			 self.results = self.results[:QueryResults.LIMIT]

		formatted = []
		for res in self.results:
			row = []
			for element in res:
				row.append(element)
			formatted.append(row)

		self.results = formatted
		self.results = [list(a) for a in self.results]
		return

class DatabaseTable(Document):

	id = fields.StringField(primary_key = True, required=True)
	name = fields.StringField(required=True)
	handle = fields.StringField(required=True)
	type = fields.StringField(required=True)
	db = fields.StringField(required=True)

	meta = {
		'collection' : 'tables',
	}

	@property
	def query_name(self):
		return self.db + '.' + self.handle + '.' + self.id

	# Generates QueryResult Object
	def queryTop5(self):
		sql = "SELECT Top 5 * FROM {}".format(self.query_name)

		results = QueryResults(table = self.id, sql = sql, columns = [])
		queried = db.queryRCGReporting(sql, columns = True)

		results.results = queried['results'] 
		formatted = []
		for res in results.results:
			row = []
			for element in res:
				row.append(element)
			formatted.append(row)

		results.results = formatted
		results.results = [list(a) for a in results.results]

		results.columns = queried['columns'] 
		return results

class Database(Document):
	id = fields.StringField(primary_key = True, required=True)
	name = fields.StringField(required=True)
	tables = fields.ListField(fields.ReferenceField(DatabaseTable))

	meta = {
		'collection' : 'databases',
	}

	structures = [
		{'id' : 'Diligence', 'name' : 'Diligence'},
		{'id' : 'AssetAllocation', 'name' : 'Asset Allocation'},
		{'id' : 'Clients', 'name' : 'Clients'},
		{'id' : 'RCGIndices', 'name' : 'RCG Indices'},
		{'id' : 'Research', 'name' : 'Research'},
		{'id' : 'Risk', 'name' : 'Research'}
	]

	@staticmethod
	def refresh():
		Database.objects.delete()

		for structure in Database.structures:
			print 'Refreshing Database {}'.format(structure['id'])
			structureObject = Database(name = structure['name'], id = structure['id'])

			try:
				queryString = "SELECT * FROM %s.information_schema.tables ORDER BY table_type, table_name" % structureObject.id
				results = db.queryRCGReporting(queryString)
				for result in results:
					result = DatabaseTableResult(result)  
	
					table = DatabaseTable(id = result.id, name = result.name, handle = result.handle, type = result.type, db = result.db)
					table.save()
					structureObject.tables.append(table)

			except:
				print 'Error: Could Not Access Database {}'.format(structure['id'])
			structureObject.save()
		return

