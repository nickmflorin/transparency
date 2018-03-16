import sys
sys.dont_write_bytecode = True
import datetime 
import pandas as pd 
from rest_framework import serializers, response, filters, viewsets
from rest_framework.renderers import JSONRenderer
from rest_framework_mongoengine.serializers import EmbeddedDocumentSerializer, DocumentSerializer

from ..models import ManagerReturns, ManagerReturn, Manager, Strategy, Range
import transparency.utility as utility 

from range import RangeSerializer
from metrics import ReturnStats

class ReturnStatsSerializer(EmbeddedDocumentSerializer):
	class Meta:
		model = ReturnStats
		fields = '__all__'

class SingleReturnSerializer(EmbeddedDocumentSerializer):
	class Meta:
		model = ManagerReturn
		fields = '__all__'

# Serializer for Single Return Stream... ReturnsSerializer Breaks Returns Into 
# Stream for All Returns and Any Possible Slices with Statistics
class ReturnsSerializer(EmbeddedDocumentSerializer):
	complete = serializers.SerializerMethodField()
	series = serializers.SerializerMethodField()
	stats = serializers.SerializerMethodField()
	range = serializers.SerializerMethodField()

	class Meta:
		model = ManagerReturns
		fields = ('stats','series','range','complete')

	# For Now - > Just Returns API Specified Range (i.e. Dates from API Request)... In Future -> May Want to Set Based on Range of Returns if
	# Start or End Dates Not Specified in API Request
	def get_context_range(self):
		request = self.context.get('request')
		range_ = Range(start = None, end = None)
		if request:
			range_ = Range.from_request(request)
			range_.validate() # Throws Errors if Invalid
		return range_

	# Have to Attribute Range as Serialized Method Since We Dont Manually Instantiate Returns, Referenced from Manager
	def get_range(self, model):
		range_ = self.get_context_range()
		serial = RangeSerializer(range_)
		return serial.data 
		
	# Parses Between Dates if Dates Supplied
	def perform_slice(self, model):
		range_ = self.get_context_range()

		if not range_.missing:
			model = ManagerReturns.create_slice(model, range_)
		return model

	# Parses Between Dates if Dates Supplied
	def get_series(self, model):
		new = self.perform_slice(model)
		serial = SingleReturnSerializer(new.series, many=True)
		return serial.data

	def get_complete(self, model):
		serial = SingleReturnSerializer(model.series, many=True)
		return serial.data

	def get_stats(self, model):
		new = self.perform_slice(model)

		# Range Will be None if There Are No Dates Within Sliced Range
		# Have to Supply Range to Stats Since Range Might Be Outside of Available Dates in Series... Matters for Cumlative Returns
		range_ = self.get_context_range()
		stats = ReturnStats.create(new.series, range_)
		serial = ReturnStatsSerializer(stats).data
		return serial

# Only Includes Returns for Manager
class ManagerReturnsSerializer(EmbeddedDocumentSerializer):
	returns = ReturnsSerializer()

	class Meta:
		model = Manager
		fields = ('id','returns')
		depth = 1


