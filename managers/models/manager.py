import sys
sys.dont_write_bytecode = True
import datetime 
import time 

from mongoengine import Document, EmbeddedDocument, fields
import multiprocessing 

import db
import common.utility as utility 

from strategy import Strategy, SubStrategy
from returns import  ManagerReturns, ManagerReturn

from process.managers import ManagerProcess

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
	def refresh(strategy = True, substrategy = True, returns = True):
		batch_size = 1000

		queryString = """ SELECT DISTINCT FundsID, FundName FROM {} ORDER BY FundsID desc""".format(Manager.database)
		results = db.queryRCG(queryString, title="Managers", db=Manager.database, notify=True, timer=True)
		print 'Retrieved {} Managers from Trasnparency Database'.format(len(results))

		batches = [results[x:x+batch_size] for x in xrange(0, len(results), batch_size)]
		processes = []
		for i in range(len(batches)):
			proc = ManagerProcess(batches[i], i+1, len(batches))
			p = multiprocessing.Process(target=proc.process)
			processes.append(p)

		for process in processes:
			process.start()
		for process in processes:
			process.join()

		return


	

