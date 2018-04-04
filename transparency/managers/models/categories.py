import sys
sys.dont_write_bytecode = True

from multiprocessing import Pool, Process
from mongoengine import Document, EmbeddedDocument, DynamicEmbeddedDocument, fields

import transparency.utility as utility 
import transparency.db as db 

from manager import Manager
import process.categories as proc

class ManagerCategoryExposure(Document):
	manager_id = fields.IntField(required = True)
	date = fields.DateTimeField(required = True)

	category = fields.StringField(required = True, choices = ['sector','asset','region','currency','strategy','market_cap'])
	name_1 = fields.StringField(required = True)
	name_2 = fields.StringField(required = False) 
	name_3 = fields.StringField(required = False)
	name_4 = fields.StringField(required = False)

	tier = fields.StringField(required = True, choices = ['long','short','gross','net','pct_gross'])
	value = fields.FloatField(default=0.0)

	class Meta:
		managed = True 
		app_label = 'api'

	meta = {
		'collection' : 'categories',
		'ordering': ['-date'],
	}

# TO DO: We want to start excluding 0 values from exposure in order to not overfill the database with unnecessary information.

# To Do: Exposure Groupings Currently Setup as Having Individual Exposures Stored Separately... Might Want to Group in Database So These Work
# / Are More Consistent with New Serializer Method
class ManagerCategoryExposures(Document):
	id = fields.IntField(required = True)
	exposures = fields.ListField(fields.ReferenceField(ManagerCategoryExposure))

	meta = {
		'collection' : 'grouped_categories',
	}

	@staticmethod
	def refresh():
		batch_size = 200
		managers = list(Manager._get_collection().find({}))

		batches = [managers[x:x+batch_size] for x in xrange(0, len(managers), batch_size)]

		processes = []
		for i in range(len(batches)):
			p = Process(target=proc.refresh_batch, args=(batches[i], i+1, len(batches)))
			processes.append(p)

		for process in processes:
			process.start()

		for process in processes:
			process.join()
		return 
