import sys
sys.dont_write_bytecode = True
from mongoengine import Document, EmbeddedDocument, fields

from pymongo import UpdateOne, InsertOne, DeleteMany
from pymongo.errors import BulkWriteError
import pandas as pd 

from server.api import db

class ManagerPeerResult(dict):
	def __init__(self, row):
		super(ManagerPeerResult, self).__init__({})

		self['id'] = int(row[0])
		self['peer_id'] = int(row[1])
		return

class ManagerPeers(object):

	# TO Do: Need to Validate That Each Peer ID Exists for a Manager in the Database
	@staticmethod
	def query(managers):
		assignments = {}
		chunks = [managers[x:x+1000] for x in xrange(0, len(managers), 1000)]

		for chunk in chunks:
			queryString = """SELECT DISTINCT p.groupid, f.fundsid
					FROM diligence.dbo.peercorelist p
					LEFT OUTER JOIN diligence.dbo.peerlistxfund px
					ON p.id = px.listid
					LEFT OUTER JOIN diligence.dbo.funds f
					ON px.fundsid = f.fundsid
					WHERE ISNUMERIC(p.groupid)=1 AND f.fundsid IN {}""".format(str(tuple([int(mgr['_id']) for mgr in chunk])))

			results = db.queryRCG(queryString, title="Peers", db="Diligence.dbo.PeerCoreList")

			for result in results:
				assignment = ManagerPeerResult(result)
				if not assignments.get(assignment['id']):
					assignments[assignment['id']] = []
				assignments[assignment['id']].append(assignment['peer_id'])

		return assignments


