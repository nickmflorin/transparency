import sys
sys.dont_write_bytecode = True
from mongoengine import Document, EmbeddedDocument, fields
from django.core.cache import cache
from rest_framework import serializers, response, filters, viewsets

import time 
import datetime 
import apps.db as db
from positions import FundPosition
from results import FundResult

class Fund(Document):
	id = fields.IntField(primary_key = True, required=True) # ID is Enum ID from DB
	name = fields.StringField(required=True)
	code = fields.StringField(required=True)
	short_name = fields.StringField(required=False)

	meta = {
		'collection' : 'funds',
	}

	def __str__(self):
		return 'Fund : %s, %s' % (self.id, self.name)

	# Queries and Refreshes Strategy Models 
	@staticmethod 
	def refresh():
		print 'Refreshing Funds'
		queryString = """SELECT RCGFundID, RCGFundName, SecurityCode, FundNameShort
						 FROM NavModel.dbo.VRCGFunds"""

		results = db.queryRCG(queryString)
		print 'Queried {} Funds'.format(len(results))

		Fund.objects.delete()
		to_insert = []
		for result in results:
			result = FundResult(result)
			new = Fund(id = result.id, name = result.name, code = result.code, short_name = result.short_name)
			to_insert.append(new)

		Fund.objects.insert(to_insert)

		funds = Fund.objects.all()
		positions = FundPosition.refresh(funds = funds)
		return