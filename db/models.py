import sys
sys.dont_write_bytecode = True

from mongoengine import Document, EmbeddedDocument, fields

from pymongo import UpdateOne, InsertOne, DeleteMany
from pymongo.errors import BulkWriteError
import pandas as pd 

from query import queryRCG, queryRCGReporting
from results import DatabaseTableResult

from accounts.models import TransparencyUser

# Results from Actual Query of Database
class QueryResults(Document):
	sql = fields.StringField(primary_key = True, required=True)
	table = fields.ReferenceField('DatabaseTable')
	columns = fields.ListField(fields.StringField())
	results = fields.ListField(fields.DynamicField())
	
	limit = fields.IntField(required=False)

	warning = fields.StringField(required=False)
	error = fields.StringField(required=False)

	def retrieve(self, limit = None):
		if not self.sql:
			raise Exception('Cannot Retrieve Results for Missing SQL')

		queried = queryRCGReporting(self.sql, columns = True)

		self.columns = queried['columns'] 
		results = queried['results'] 
		if limit and len(results) > limit:
			self.warning = 'Query Returned {} Rows... Top {} Shown Here'.format(str(len(results)), str(limit))
			results = results[:limit]
			
		self.results = []
		for res in results:
			row = {}
			for i in range(len(self.columns)):
				row[self.columns[i]] = res[i]
			self.results.append(row)

		return

class SavedQuery(Document):
	user = fields.IntField(required=True)
	createdAt = fields.DateTimeField(required = True)
	name = fields.StringField(required=True)
	sql = fields.StringField(required=True)

	meta = {
		'collection' : 'queries',
		'indexes': [
			{'fields': ['$name', "$user"]}
		]
	}

	def run(self, limit = None):
		results = QueryResults(sql = self.sql, limit = limit)
		results.retrieve()
		return results

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
		results.retrieve()
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
		{'id' : 'Risk', 'name' : 'Risk'}
	]

	@staticmethod
	def refresh():
		Database.objects.delete()

		for structure in Database.structures:
			print 'Refreshing Database {}'.format(structure['id'])
			structureObject = Database(name = structure['name'], id = structure['id'])

			try:
				queryString = "SELECT * FROM %s.information_schema.tables ORDER BY table_type, table_name" % structureObject.id
				results = queryRCGReporting(queryString)
				for result in results:
					result = DatabaseTableResult(result)  
	
					table = DatabaseTable(id = result.id, name = result.name, handle = result.handle, type = result.type, db = result.db)
					table.save()
					structureObject.tables.append(table)

			except:
				print 'Error: Could Not Access Database {}'.format(structure['id'])
			structureObject.save()
		return

