import sys
sys.dont_write_bytecode = True

from multiprocessing import Pool, Process
import itertools
from functools import partial
import pymongo

import db 
from results import ManagerCategoryExposureResult

def process(results, batch):
	exposures = []
	for result in results:
		result = ManagerCategoryExposureResult(result)

		# Ignores Unwanted Categories and Invalid Tiers
		if result.valid:
			exposure = {
			    'manager_id' : result.id, 
			    'date' : result.date, 
			    'category' : result.category, 
			    'name_1' : result.name_1, 
			    'name_2' : result.name_2, 
			    'name_3' : result.name_3, 
			    'name_4' : result.name_4, 
			    'value' : result.value,
			    'tier' : result.tier,
			}
			exposures.append(exposure)
	return exposures

def get_query_string(ids):
	queryString = """
		SELECT ManagerID, ReportDate, Tier2, DefaultMeasureFilled, Category1, Category2, Category3, Category4, Category5
	 	FROM Risk.dbo.vFactManagerRisk 
	 	WHERE Tier1 = 'Tier 1 - Exposure' AND NOT IsNull(Category1, '') = '' AND NOT IsNull(Category2, '')='' AND DefaultMeasureFilled IS NOT NULL"""
	queryString += """ AND ManagerID IN {}""".format(str(tuple(ids)))

	return queryString

def refresh_batch(batch, num, total):
	batch_prefix = 'Batch {} / {} : '.format(num,total)
	ids = [int(manager['_id']) for manager in batch]

	# To Do: Move Client Connection to Parent Object to Not Reopen Connection Each Time
	client = pymongo.MongoClient("localhost", 27017, maxPoolSize=50)
	database = client['peers']
	collection = database['categories']

	print batch_prefix + 'Clearing Existing Manager Category Exposures...'
	collection.remove({
	    'manager_id' : { '$in' : ids},                          
	})
	print batch_prefix + 'Querying Exposures from Transparency'

	queryString = get_query_string(ids)
	results = db.queryRCG(queryString, title="Exposures", db="Diligence.dbo.vFactManagerRisk", notify=False, timer=False)

	print batch_prefix + 'Processing {} Results'.format(len(results))

	pool = Pool(10)
	process_batch_size = 10
	processes = [results[x:x+process_batch_size] for x in xrange(0, len(results), process_batch_size)]

	part = partial(process, batch=num)

	exposures = pool.map(part, processes)
	exposures = list(itertools.chain.from_iterable(exposures))

	if len(exposures) != 0:
		print batch_prefix + 'Saving Processed Results'
		collection.insert(exposures)
		print batch_prefix + 'Saved {} Category Exposures for {} Managers...'.format(len(exposures), len(ids))



