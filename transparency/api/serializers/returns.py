import sys
sys.dont_write_bytecode = True
import datetime 
import pandas as pd 
from rest_framework import serializers, response, filters, viewsets
from rest_framework.renderers import JSONRenderer
from rest_framework_mongoengine.serializers import EmbeddedDocumentSerializer, DocumentSerializer

from transparency.api.models import manager, strategy
from transparency.api.models.returns import ManagerReturns, ManagerReturn
from stats import ReturnStats

class Range(object):
	__fields__ = ('start','end')
	def __init__(self, **kwargs):
		for field in ('start','end'):
			setattr(self, field, kwargs.get(field, None))
	@property
	def outside(self):
		return self.start is None and self.end is None 

	@property
	def missing(self):
		return self.start is None and self.end is None 

	@property 
	def valid(self):
		if self.start and self.end and self.start > self.end:
			return False 
		return True

	@staticmethod
	def from_request(request):
		range_ = Range(start = None, end = None)
		
		range_.start = request.GET.get('start_date')
		range_.end =  request.GET.get('end_date')

		if range_.start:
			range_.start = datetime.datetime.strptime(range_.start, '%Y-%m-%d')
		if range_.end:
			range_.end = datetime.datetime.strptime(range_.end, '%Y-%m-%d')
		return range_ 

class RangeSerializer(serializers.Serializer):
	start = serializers.DateTimeField(required = False)
	end = serializers.DateTimeField(required = False)

	def create(self, validated_data):
		return Range(id=None, **validated_data)

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

	date_range = serializers.SerializerMethodField()
	date_bounds = serializers.SerializerMethodField()

	class Meta:
		model = ManagerReturns
		fields = ('stats','series','date_bounds','date_range','complete')

	def get_context_range(self):
		request = self.context.get('request')
		if request:
			range_ = Range.from_request(request)
			if not range_.valid:
				raise Exception('Start Date Must be Before End Date')
		return range_

	# Parses Between Dates if Dates Supplied
	def perform_slice(self, model):
		range_ = self.get_context_range()
		if not range_.missing:
			model = ManagerReturns.create_slice(model, start = range_.start, end = range_.end)

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

	def get_date_bounds(self, model):
		range_ = Range(start = None, end = None)

		dates = [ret.date for ret in model.series]
		if len(dates) != 0:
			range_ = Range(start = min(dates), end = max(dates))
		
		serial = RangeSerializer(range_)
		return serial.data

	def get_date_range(self, model):
		range_ = Range(start = None, end = None)
		new = self.perform_slice(model)

		dates = [ret.date for ret in new.series]
		if len(dates) != 0:
			range_ = Range(start = min(dates), end = max(dates))

		serial = RangeSerializer(range_)
		return serial.data

# Only Includes Returns for Manager
class ManagerReturnsSerializer(EmbeddedDocumentSerializer):
	returns = ReturnsSerializer()

	class Meta:
		model = manager.Manager
		fields = ('id','returns')
		depth = 1


