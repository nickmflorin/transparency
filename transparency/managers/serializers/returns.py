import sys
sys.dont_write_bytecode = True
import datetime 
import pandas as pd 
from rest_framework import serializers, response, filters, viewsets
from rest_framework.renderers import JSONRenderer
from rest_framework_mongoengine.serializers import EmbeddedDocumentSerializer, DocumentSerializer

from transparency.config.models import Range 
from transparency.config.serializers import RangeSerializer
import transparency.utility as utility

from stats import ReturnStatsSerializer
from ..models import ManagerReturns, ManagerReturn, CumReturn, Manager, Strategy, ReturnStats

class SingleReturnSerializer(EmbeddedDocumentSerializer):
	class Meta:
		model = ManagerReturn
		fields = '__all__'

# No Stats and Complete Return Series for Manager
class SimpleReturnsSerializer(EmbeddedDocumentSerializer):
	series = serializers.SerializerMethodField()
	range = serializers.SerializerMethodField()
	complete_range = serializers.SerializerMethodField()

	class Meta:
		model = ManagerReturns
		fields = ('series','range','complete_range')

	def get_series(self, model):
		serial = SingleReturnSerializer(model.series, many=True)
		return serial.data

	def get_complete_range(self, model):
		range_ = model.basic_range # Just Based on Overall Start and End Dates
		serial = RangeSerializer(range_)
		return serial.data 

	def get_range(self, model):
		range_ = model.basic_range # Just Based on Overall Start and End Dates
		serial = RangeSerializer(range_)
		return serial.data 

# Serializer for Single Return Stream... ReturnsSerializer Breaks Returns Into 
# Stream for All Returns and Any Possible Slices with Statistics
class ReturnsSerializer(EmbeddedDocumentSerializer):
	id = serializers.SerializerMethodField()
	stats = serializers.SerializerMethodField()
	range = serializers.SerializerMethodField()
	complete_range = serializers.SerializerMethodField()
	series = serializers.SerializerMethodField()

	class Meta:
		model = ManagerReturns
		fields = ('stats','series','range','id', 'complete_range')

	def get_id(self, model):
		id = self.context.get('id')
		if not id:
			raise Exception('Must Provide ID Context')
		return id

	def get_complete_range(self, model):
		range_ = model.basic_range # Just Based on Overall Start and End Dates
		serial = RangeSerializer(range_)
		return serial.data 

	def get_range(self, model):
		range_ = self.context.get('range')
		if not range_:
			raise Exception('Must Provide Range Context')

		endpoints = model.basic_range # Just Based on Overall Start and End Dates
		endpoints.restrict(range_)
		serial = RangeSerializer(endpoints)
		return serial.data 

	def get_series(self, model):
		range_ = self.context.get('range')
		if not range_:
			raise Exception('Must Provide Range Context')

		returns = model.slice(range_)
		serial = SingleReturnSerializer(returns.series, many=True)
		return serial.data

	def get_stats(self, model):
		range_ = self.context.get('range')
		if not range_:
			raise Exception('Must Provide Range Context')

		stats = ReturnStats(cumulative = [])
		returns = model.slice(range_)
		serial = ReturnStatsSerializer(stats, context={'returns': returns, 'range': range_})
		return serial.data


