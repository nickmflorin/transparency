import sys
sys.dont_write_bytecode = True
from mongoengine import Document, EmbeddedDocument, fields
from django.core.cache import cache
from rest_framework import serializers, response, filters, viewsets

import time 
import datetime 
import transparency.db as db
from results import FundPositionResult

class FundPosition(EmbeddedDocument):
	id = fields.IntField(primary_key = True, required=True) # ID is Enum ID from DB

	meta = {
		'collection' : 'positions',
	}

	@staticmethod 
	def refresh(funds = []):
		print 'Refreshing Fund Positions'

		queryString = """SELECT RCGFundID, RCGFundName, ManagerID, ManagerName, TranDate, BeginningWeight, EndingAllocation, EndingWeight, TranType
						 FROM NavModel.dbo.vNavModel WHERE RCGFundID in {}""".format(str(tuple([fund.id for fund in funds])))

		positions = {}
		results = db.queryRCG(queryString)
		for result in results[:10]:
			print result 
			result = FundPositionResult(result)

			if not positions.get(result.id):
				positions[result.id] = []
			positions[result.id].append(position.to_model())
		
		print positions
		return
