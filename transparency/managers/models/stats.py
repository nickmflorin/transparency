import sys
sys.dont_write_bytecode = True
from mongoengine import Document, EmbeddedDocument, fields

from returns import ManagerReturns, CumReturn
from transparency.config.models import Range 

class ReturnStats(EmbeddedDocument):

	total = fields.FloatField(required=True, default=0.0)
	maximum = fields.FloatField(required=True, default=0.0)
	minimum = fields.FloatField(required=True, default=0.0)
	average = fields.FloatField(required=True, default=0.0)
	ytd = fields.FloatField(required=True, default=0.0)
	std_dev_annual = fields.FloatField(required=True, default=0.0)
	var = fields.FloatField(required=True, default=0.0)
	max_drawdown = fields.FloatField(required=True, default=0.0)
	extreme_shortfall = fields.FloatField(required=True, default=0.0)
	skew = fields.FloatField(required=True, default=0.0)

	cumulative = fields.ListField(fields.EmbeddedDocumentField(CumReturn))
	range = fields.EmbeddedDocumentField(Range)
	
	__cum_months__ = [3,6,9,12,24,36,60]


	
